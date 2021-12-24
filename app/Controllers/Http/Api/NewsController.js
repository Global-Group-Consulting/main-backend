'use strict';

/** @typedef {import("/@types/News").News} NewsType */
/** @typedef {import("/@types/News").NewsCreateDto} NewsCreateDto */
/** @typedef {import("/@types/News").NewsUpdateDto} NewsUpdateDto */
/** @typedef {import("../../../Models/News")} News */

const { castToObjectId } = require('../../../Helpers/ModelFormatters');
const NewsException = require('../../../Exceptions/NewsException');

/** @type {typeof import("../../../Models/News")} */
const NewsModel = use("App/Models/News");
/** @type {typeof import("../../../Models/NewsStatus")} */
const NewsStatusModel = use("App/Models/NewsStatus");
/** @type {typeof import("../../../Models/File")} */
const File = use('App/Models/File');

const AclProvider = use("AclProvider");

class NewsController {
  /**
   * Read all existing news;
   */
  async read ({ auth }) {
    const data = await NewsModel.with("readings", builder => builder.where("userId", auth.user._id))
      .sort({ "createdAt": -1, "startAt": -1, "endAt": -1 }).fetch();

    /*return data.rows.sort((a, b) => {
      return a.readings.createdAt - b.readings.createdAt;
    });*/

    // Maybe is not a good idea to order by reading status, otherwise the news will move
    // and the user could lose its position
    return data;
  }

  /**
   * Create a new db entry
   * Permissions are checked by the dedicated middleware
   */
  async create ({ auth, request }) {
    const adminId = auth.user._id;
    /** @type {NewsCreateDto} **/
    const incomingData = request.all();

    /** @type {NewsType} */
    const newNewsData = {
      title: incomingData.title,
      text: incomingData.text,
      createdBy: adminId,
      startAt: incomingData.startAt,
      endAt: incomingData.endAt,
      active: true,
    };

    const files = request.files();

    // If there are files, tries to upload them
    if (files) {
      const filesToUpload = [];

      if (files.newsImg) {
        filesToUpload.push(files.newsImg);
      }

      if (files.newsAttachments) {
        filesToUpload.push(files.newsAttachments);
      }

      const storedFiles = await File.store(filesToUpload.flat(), null, adminId);
      const formattedStoredFiles = File.getFilesAsObj(storedFiles, files);

      newNewsData.newsImg = formattedStoredFiles.newsImg;
      newNewsData.newsAttachments = formattedStoredFiles.newsAttachments;
    }

    const createdNews = await NewsModel.create(newNewsData);

    // immediatly create the readed entry
    const readingStatus = await NewsStatusModel.create({
      userId: adminId,
      newsId: createdNews._id
    });

    createdNews.readings = [
      readingStatus.toJSON()
    ];

    return createdNews;
  }

  /**
   * Return only the unread news for the authenticated user
   */
  async readPerUser ({ auth }) {
    const userId = auth.user._id;

    return NewsModel.readUnreadOnes(userId);
  }

  async update ({ auth, request, params }) {
    const newsId = params.id;

    /** @type {News & Model} */
    const newsToUpdate = await NewsModel.findOrFail(newsId);

    /** @type {NewsUpdateDto} */
    const incomingData = request.all();

    // handle uploaded files
    /** @type {Pick<NewsUpdateDto, "newsImg" | "newsAttachments">} */
    const files = request.files();

    for (const entry of Object.entries(files)) {
      const key = entry[0];
      const value = entry[1];
      const asArray = value instanceof Array;

      // delete existing file
      if (newsToUpdate[key] && !asArray) {
        await File.deleteAllWith(newsToUpdate[key].id);
      } else if (!newsToUpdate[key] && asArray) {
        //initialize it as an array
        newsToUpdate[key] = [];
      }

      // Upload the new ones
      const storedFile = await File.store([value].flat(), null, auth.user._id);

      if (asArray) {
        newsToUpdate[key].push(...File.getFilesAsObj(storedFile, files)[key]);
      } else {
        newsToUpdate[key] = File.getFilesAsObj(storedFile, files)[key];
      }
    }

    // merge data and save it
    newsToUpdate.merge(incomingData);
    await newsToUpdate.save();

    return newsToUpdate;
  }

  /**
   * Updates the status of one news for the authenticated user
   */
  async updateStatus ({ auth, params }) {
    const userId = auth.user._id;
    const newsId = castToObjectId(params.id);

    const existing = await NewsStatusModel.where({ userId, newsId }).first();

    // If already exists, update it
    if (existing) {
      existing.updatedAt = new Date();
      await existing.save();

      return NewsStatusModel.where({ userId, newsId }).first();
    }

    return NewsStatusModel.create({
      userId,
      newsId
    });
  }

  async delete ({ params, response }) {
    // when deleting, also remove read entries from newsStatus
    const toDelete = await NewsModel.with("readings").find(params.id);

    if (!toDelete) {
      throw new NewsException("News not found.");
    }

    // Delete all relative news readings
    await toDelete.readings().delete();
    // delete also the news
    await toDelete.delete();

    response.ok();
  }

  async deleteAttachment ({ params, response }) {
    const toDeleteId = params.id;

    /** @type {News & Model} */
    const toUpdateNews = await NewsModel.where({ "newsAttachments.id": castToObjectId(toDeleteId) }).first();

    if (!toUpdateNews) {
      throw new NewsException("File not found");
    }

    await File.deleteAllWith(toDeleteId);
    const index = toUpdateNews.newsAttachments.findIndex(file => file.id.toString() === toDeleteId);

    toUpdateNews.newsAttachments.splice(index, 1);

    await toUpdateNews.save();

    response.ok();
  }

}

module.exports = NewsController;

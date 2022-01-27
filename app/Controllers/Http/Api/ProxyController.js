'use strict'

const axios = require("axios")
const SecretKey = use("App/Models/SecretKey")
const ProxyException = use("App/Exceptions/ProxyException");
const Env = use("Env")
const File = use('App/Models/File')

class ProxyController {

  /**
   *
   * @param files
   * @param authUserId
   * @return {Promise<Record<string, {"id": string, "fileName": string, "size": string, "mimetype": string}>>}
   * @private
   */
  async _uploadFiles(files, authUserId) {

    if (Object.keys(files).length > 0) {

      const uploadedFiles = await File.store(Object.values(files).flat(), null, authUserId);

      /* uploaded file fields
      {
        "_id": "613a104b96f5cd307073fc7c",
        "clientName": "telegram-cloud-photo-size-4-5823176149965059860-y.jpg",
        "extname": "jpg",
        "fileName": null,
        "fieldName": "image",
        "size": 44500,
        "type": "image",
        "subtype": "jpeg",
        "status": "consumed",
        "error": {},
        "fileUrl": "https://ggclocalhost.s3.eu-central-1.amazonaws.com/613a104b96f5cd307073fc7c",
        "userId": null,
        "loadedBy": "5fc411ba5314e159727c9d37",
        "created_at": "2021-09-09T13:46:51.948Z",
        "updated_at": "2021-09-09T13:46:51.948Z",
        "id": "613a104b96f5cd307073fc7c"
      }
      */

      return uploadedFiles.reduce((acc, curr) => {
        const file = {
          "id": curr._id.toString(),
          "fileName": curr.clientName,
          "size": curr.size,
          "mimetype": curr.type + "/" + curr.subtype,
        }

        const fieldName = curr.fieldName.replace("[]", "")
        const asArray = files[fieldName] instanceof Array

        // if the section doesn't exist, creates it as an array
        // should be created as an array only if the incoming type was an array
        if (!acc[fieldName] && asArray) {
          acc[fieldName] = []
        }

        if (asArray) {
          acc[fieldName].push(file)
        } else {
          acc[fieldName] = file;
        }

        return acc
      }, {})
    }
  }

  async _deleteFiles(files) {
    await File.deleteAllWith(Object.values(files).flat().reduce((acc, curr) => {
      acc.push(curr.id)

      return acc
    }, []))
  }

  /**
   * @param {String} url
   * @param {Request} req
   * @param {User} user
   * @param {'club'} prefix
   * @private
   */
  async _forward(url, req, user, path) {
    const parsedUrl = new URL(url);
    /**
     * @type {{host: string, accept: string, "client-key": string}}
     */
    const headers = req.headers();
    const reqBody = req.body;
    // const reqParams = req.qs
    const reqParams = req.originalUrl().split("?")[1];
  
    headers.host = parsedUrl.host;
    headers.accept = "application/json";
    headers["content-type"] = "application/json";
    headers["client-secret"] = await SecretKey.getClientKey(headers["client-key"]);
    headers["server-secret"] = Env.get("SERVER_KEY");

    let result;
    let uploadedFiles;

    try {
      uploadedFiles = await this._uploadFiles(req.files(), user._id);

      if (uploadedFiles) {
        Object.keys(uploadedFiles).forEach(fieldName => {
          reqBody[fieldName] = uploadedFiles[fieldName]
        })
      }

      /*
      La cancellazione deve essere prima controllata dal server finale.
      sarà compito di quest'ultimo richiedere la cancellazione da questo server e dallo Storage,
      tramite chiamata api.
      /!*
      If the request is a DELETE and contains "filesToDelete", remove the files from DB and Storage
       *!/
      if (req.method().toLowerCase() === "delete" && reqBody.hasOwnProperty("filesToDelete")) {
        await this._deleteFiles(reqBody.filesToDelete)
      }*/

      result = await axios.request({
        url: url + path + (reqParams ? ('?' + reqParams) : ''),
        method: req.method(),
        headers: headers,
        data: {
          ...reqBody,
          _auth_user: user
        },
        // params: reqParams
      })

      return result.data
    } catch (er) {
      // If there are uploaded files but there is an error, delete them from the db and Storage
      if (uploadedFiles) {
        await this._deleteFiles(uploadedFiles)
      }
  
      throw new ProxyException(er)
    }
  }
  
  async club(request, auth, path) {
    const baseUrl = Env.get("CLUB_SERVER")
    
    return await this._forward(baseUrl, request, auth.user, path)
  }
  
  async news(request, auth, path) {
    const baseUrl = Env.get("NEWS_SERVER")
    
    return await this._forward(baseUrl, request, auth.user, path)
  }
  
  async handle({request, auth}) {
    const url = request.url().replace("/api/ext/", "");
    const destination = url.split("/");
    
    switch (destination[0]) {
      case "club":
        return this.club(request, auth, "/api" + url.slice(url.indexOf("/")))
      case "news":
        return this.news(request, auth, "/api" + url.slice(url.indexOf("/")))
    }
  }
}

module.exports = ProxyController

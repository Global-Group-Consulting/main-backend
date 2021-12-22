const { setAclMiddleware } = require('../../app/Helpers/Acl');
const { NewsPermissions } = require('../../app/Helpers/Acl/enums/news.permissions');

module.exports = function (Route) {
  Route.group(() => {
    Route.get("/", "NewsController.read");
    Route.post("/", "NewsController.create")
      .validator("News/create")
      .middleware(setAclMiddleware(NewsPermissions.NEWS_ALL_CREATE));

    Route.get("/user", "NewsController.readPerUser");

    Route.put("/:id", "NewsController.update")
      .validator("News/update")
      .middleware(setAclMiddleware(NewsPermissions.NEWS_ALL_CREATE));

    Route.delete("/:id", "NewsController.delete");
    Route.delete("/attachments/:id", "NewsController.deleteAttachment");

    Route.patch("/:id", "NewsController.updateStatus");

  }).prefix('/api/news')
    .middleware('auth')
    .namespace('Api');

};

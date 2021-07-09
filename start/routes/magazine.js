const {MagazinePermissions} = require("../../app/Helpers/Acl/enums/magazine.permissions")
const {setAclMiddleware} = require("../../app/Helpers/Acl")

module.exports = function (Route) {
  Route.group(() => {
    Route.get("/", "MagazineController.index")
      .middleware(setAclMiddleware(MagazinePermissions.MAGAZINE_READ))

    Route.get("/current", "MagazineController.current")

    Route.post("/", "MagazineController.store")
      .validator('magazine/create')
      .middleware(setAclMiddleware(MagazinePermissions.MAGAZINE_WRITE))

    Route.get("/:id", "MagazineController.show")
      .middleware(setAclMiddleware(MagazinePermissions.MAGAZINE_READ))

    Route.patch("/:id", "MagazineController.update")
      .validator('magazine/update')
      .middleware(setAclMiddleware(MagazinePermissions.MAGAZINE_WRITE))

    Route.delete("/:id", "MagazineController.destroy")
      .middleware(setAclMiddleware(MagazinePermissions.MAGAZINE_WRITE))

  }).prefix('/api/magazine')
    .namespace('Api')
}

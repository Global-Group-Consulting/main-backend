exports.setAclMiddleware = function (permissions) {
  if (!(permissions instanceof Array)) {
    permissions = [permissions]
  }

  permissions = permissions.map((perm) => {
    return perm.replace(/:/g, "!")
  })

  return ['acl:' + permissions.join(",")]
}

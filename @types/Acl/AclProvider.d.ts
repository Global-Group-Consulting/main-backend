interface AclProvider {
  checkPermissions(requiredPermissions: string[], auth: { user: any }): boolean
}

export {AclProvider}

interface AclProvider {
  checkPermissions (requiredPermissions: string[], auth: { user: any }): Promise<boolean>
}

export { AclProvider }

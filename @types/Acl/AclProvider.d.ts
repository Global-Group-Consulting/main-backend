interface AclProvider {
  checkPermissions (requiredPermissions: string[], auth: { user: any }): Promise<boolean>
  
  checkRoles (requiredRoles: string[], auth: { user: any }): boolean
}

export { AclProvider }

import Model from "@adonisjs/lucid/src/Lucid/Model"

export interface AclPermission {
  code: string
  description: string
  id: string
  created_at: string
  updated_at: string
}

export interface AclPermissionsModel extends Model {

}

import Model from "@adonisjs/lucid/src/Lucid/Model"
import {AclPermission} from "./Permissions";

export interface AclRole {
  code: string
  description: string
  permissions: Pick<AclPermission, "code">[]
}

export interface AclRolesModel extends Model {

}

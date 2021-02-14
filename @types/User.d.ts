import UserModel from "../app/Models/User"
import {SignRequestQuickCreate} from "./SignRequest";
import AgentTeamType from "../enums/AgentTeamType"

export interface User extends UserModel {
  'personType': string,
  'businessName': string,
  'vatNumber': string,
  'firstName': string,
  'lastName': string,
  'fiscalCode': string,
  'gender': string,
  'birthCountry': string,
  'birthProvince': string,
  'birthCity': string,
  'birthDate': string,
  'docType': string,
  'docNumber': string,
  'docExpiration': string,
  'businessCountry': string,
  'businessRegion': string,
  'businessProvince': string,
  'businessCity': string,
  'businessZip': string,
  'businessAddress': string,
  'legalRepresentativeCountry': string,
  'legalRepresentativeRegion': string,
  'legalRepresentativeProvince': string,
  'legalRepresentativeCity': string,
  'legalRepresentativeZip': string,
  'legalRepresentativeAddress': string,
  'email': string,
  'mobile': string,
  'phone': string,
  'contractNumber': string,
  'contractDate': string,
  'contractPercentage': string,
  'contractInitialInvestment': string,
  'contractSignRequest': SignRequestQuickCreate,
  'contractIban': string,
  'contractBic': string,
  'role': string,
  'referenceAgent': string,
  'created_at': string,
  'updated_at': string,
  'activated_at': string,
  'verified_at': string,
  'account_status': string,
  'hooks': Exclude<WebhooksCall, "document.signrequest">[]
  'files': any[]
  'gold': boolean
  'hasSubAgents': boolean
  'agentTeamType': typeof AgentTeamType
  'commissionsAssigned': CommissionAssigned[]
}

export interface CommissionAssigned {
  name: CommissionType,
  percent: number
}

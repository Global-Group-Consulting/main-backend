import UserModel from "../app/Models/User"
import {SignRequestQuickCreate} from "./SignRequest";
import AgentTeamType from "../enums/AgentTeamType"
import { WebhooksCall } from './SignRequest/Webhooks'

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
  'contractNumberLegacy': string,
  'contractDate': string,
  'contractPercentage': number,
  'contractInitialInvestment': string,
  'contractInitialInvestmentGold': string,
  'contractInitialPaymentMethod': string
  'contractInitialPaymentMethodOther': string
  'contractSignedAt': string
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
  clubCardNumber: string
  clubPack: string;
  _id: string;
  id: string;
  
  isAdmin(): boolean
  isAgent(): boolean
}

export interface CommissionAssigned {
  name: string
  percent: number
}

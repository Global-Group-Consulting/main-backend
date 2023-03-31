import { AdonisModel } from '../../@types/AdonisModel'

declare global {
  class User extends AdonisModel {
    id: string
    role: number
    personType: string
    businessName: string
    vatNumber: string
    firstName: string
    lastName: string
    fiscalCode: string
    gender: string
    birthCountry: string
    birthProvince: string
    birthCity: string
    birthDate: string
    docType: string
    docNumber: string
    docExpiration: string
    businessCountry: string
    businessRegion: string
    businessProvince: string
    businessCity: string
    businessZip: string
    businessAddress: string
    legalRepresentativeCountry: string
    legalRepresentativeRegion: string
    legalRepresentativeProvince: string
    legalRepresentativeCity: string
    legalRepresentativeZip: string
    legalRepresentativeAddress: string
    email: string
    mobile: string
    phone: string
    contractNumber: string
    contractDate: string
    contractPercentage: string
    contractIban: string
    contractBic: string
    contractInitialPaymentMethod: string
    contractInitialPaymentMethodOther: string
    referenceAgent: string
    referenceAgentData: any
    accountCreatedAt: string
    accountUpdatedAt: string
    accountActivatedAt: string
    accountVerifiedAt: string
    contractSignedAt: string
    signinLogs: any[]
    contractFiles: any[]
    contractImported: boolean
    account_status: string
    files: any[]
    gold: boolean
    hasSubAgents: boolean
    agentTeamType: string
    permissions: string[]
    superAdmin: boolean
    clubCardNumber: string
    clubPack: string
    autoWithdrawlAll: string | null
    autoWithdrawlAllRecursively: string | null
    suspended: boolean
    /**
     * @deprecated
     */
    clientsCount: number
    clients: number
    commissionsAssigned: any
    roles: any[]
    userOnlyClub: boolean
  
    /**
     * Get all team users of an agent2
     *
     * @param agent
     * @param excludeUser Default `false`. If `true` exclude the specified agent from the results
     * @param returnObjectIds
     */
    static async getTeamUsersIds (agent: User, excludeUser: boolean, returnObjectIds: boolean): Promise<(User | string | ObjectId)[]>
  
    /**
     * Get all users of an agent
     *
     * @param agentId Agent id
     * @param subAgentsIdList List of sub agents ids
     * @param onlyIds Will return an array of ObjectIds if `true`, otherwise will return an array of User objects
     */
    static async getClientsList (agentId, subAgentsIdList: string[], onlyIds: boolean): Promise<(User | ObjectId)[]>
  }
}


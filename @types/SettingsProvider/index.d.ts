export interface GlobalSettings {
  maintenanceMode: boolean
  requestsBlockTime: string[]
  requestsBlockTimeCriticDays: string[]
  clubRequestNotifyEmail: string
  requestMinAmount: number
  requestBritePercentage: number
}

export interface SettingsProvider {
  storeSettings(data: any)

  get(path: keyof GlobalSettings)
}

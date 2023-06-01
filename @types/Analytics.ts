declare global {
  
  interface ISession {
    id: string
    createdAt: number
    user: Pick<User, 'id' | 'role' | 'roles'>
    timers: ITimer[]
  }
  
  interface ITimer {
    pageName: string
    timeOnPage: number
  }
}

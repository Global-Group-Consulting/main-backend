export enum MovementTypeEnum {
  // Generated when recapitalization occurs
  INTEREST_RECAPITALIZED = 'interest_recapitalized',
  
  // When added by admins
  DEPOSIT_ADDED = 'deposit_added',
  
  // When removed by admins
  DEPOSIT_REMOVED = 'deposit_removed',
  
  // When a user transfers them to a user
  DEPOSIT_TRANSFERRED = 'deposit_transferred',
  
  // When a user uses them
  DEPOSIT_USED = 'deposit_used'
}

/*
export const MovementTypeOutList = [
  MovementTypeEnum.DEPOSIT_REMOVED,
  MovementTypeEnum.DEPOSIT_USED,
  MovementTypeEnum.DEPOSIT_TRANSFERRED
]
export const MovementTypeInList = [
  MovementTypeEnum.DEPOSIT_ADDED,
  MovementTypeEnum.INTEREST_RECAPITALIZED
]
*/

export interface PaginatedData {
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
  data: any[];
  
}

export interface PaginatedResult extends PaginatedData {
  sortDesc: boolean[];
  filter: any
}

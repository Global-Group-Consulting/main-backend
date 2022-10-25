import Request from '@adonisjs/framework/src/Request'

export interface RequestPagination {
  page: number;
  limit: number;
  sortBy: string[];
  sortDesc: boolean[];
  filters: { [key: string]: any };
}

export interface HttpRequest extends Request {
  pagination: RequestPagination,
  input: (key: string, defaultValue?: any) => any
}

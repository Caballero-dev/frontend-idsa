interface PageInfo {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T> {
  status: string;
  statusCode: number;
  message: string;
  data: T;
  pageInfo?: PageInfo;
}

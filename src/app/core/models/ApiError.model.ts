interface ValidationError {
  code: string;
  message: string;
}

interface ValidationErrors {
  [key: string]: ValidationError[];
}

export interface ApiError {
  timestamp: string;
  status: string;
  statusCode: number;
  message: string;
  path: string;
  validationErrors?: ValidationErrors;
}

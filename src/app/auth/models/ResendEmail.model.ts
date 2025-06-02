export type ResendEmailType = 'EMAIL_VERIFICATION' | 'EMAIL_CHANGE';

export interface ResendEmailRequest {
  email: string;
  // type: ResendEmailType;
}

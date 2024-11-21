export interface ErrorLog {
  message: string;
  stack?: string;
  path?: string;
  method?: string;
  statusCode?: number;
  createdAt: Date;
}

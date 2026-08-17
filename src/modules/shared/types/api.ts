export interface ApiErrorShape {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export type LogEventLevel = 'debug' | 'info' | 'error';

export interface LogEvent {
  id: string;
  type: string;
  level: LogEventLevel;
  data: object;
  createdAt: number;
}
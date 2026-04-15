export interface SocketMessage<TPayload> {
  topic: string;
  payload: TPayload;
}
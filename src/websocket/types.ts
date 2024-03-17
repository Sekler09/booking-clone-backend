export interface BookPayload {
  roomId: string;
  dates: {
    from: Date;
    to: Date;
  };
}

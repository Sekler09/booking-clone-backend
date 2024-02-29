import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { BookPayload } from './types';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('book')
  async handleSendMessage(client: Socket, payload: BookPayload): Promise<void> {
    client.broadcast.emit('book', payload);
  }
}

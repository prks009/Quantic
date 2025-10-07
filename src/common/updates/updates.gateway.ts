import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'updates', // Namespace for updates
})
export class UpdatesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`webSocket is connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`webSocket is disconnected: ${client.id}`);
  }

  broadcastActivityUpdate(payload: any) {
    this.server.emit('activity_update', payload);
  }
}
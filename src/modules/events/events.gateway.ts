import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebSocketExceptionFilter } from '@/filters/ws-exception.filter';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENT } from '@/common/constants';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
@UsePipes(new ValidationPipe())
@UseFilters(new WebSocketExceptionFilter())
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  server: Server;

  afterInit(server: Server) {
    this.server = server;
  }

  async handleConnection(client: Socket) {
    console.log(`Client ${client.id} connected.`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected.`);
  }

  @OnEvent(EVENT.BID.CREATED)
  handleBid(payload: any) {
    console.log(EVENT.BID.CREATED, payload);
  }

  @OnEvent(EVENT.BID.COMPLETED)
  handleBidCompleted(payload: any) {
    console.log(EVENT.BID.COMPLETED, payload);
  }
}

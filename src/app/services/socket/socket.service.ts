import { io } from 'socket.io-client'
import { Injectable } from '@angular/core';


@Injectable({providedIn:'root'}) export class SocketService {
  socket = io(import.meta.env.NG_APP_SERVER,{autoConnect:false})
}

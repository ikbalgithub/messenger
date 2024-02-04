import { signal } from '@angular/core' 
import { io,Socket } from 'socket.io-client'
import { Injectable,OnInit,OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  connected = false
  socket = io(import.meta.env.NG_APP_SERVER)

  onDisconnect = this.socket.on('disconnect',() => {
    this.connected = false
  })
}

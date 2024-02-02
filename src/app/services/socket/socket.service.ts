import { io } from 'socket.io-client'
import { Injectable,OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  connected = false
  socket = io(import.meta.env.NG_APP_SERVER)

  ngOnDestroy(){
    this.socket.disconnect()
  }
}

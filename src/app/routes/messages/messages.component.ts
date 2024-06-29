import { io } from 'socket.io-client'
import { CommonModule } from '@angular/common';
import { Component,OnInit,OnDestroy,inject,ViewChild } from '@angular/core';
import { StoreService } from '../../services/store/store.service'
import { HistoryComponent } from '../../components/history/history.component'
import { RequestService } from '../../services/request/request.service';
import { Search } from '../../..';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { SocketService } from '../../services/socket/socket.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [HistoryComponent,CommonModule,FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit, OnDestroy {
  @ViewChild('history') history !:HistoryComponent

  socketService  = inject(SocketService)
  storeService   = inject(StoreService)
  user           = this.storeService.user()
  requestService = inject(RequestService)
  router         = inject(Router)
  authService    = inject(AuthService)
  
  ngOnInit(){
    this.socketService.socket.on('connect',() => {
      this.socketService.socket.emit(
        'join',
        `history/${this.user._id}`
      )
    })

    this.socketService.socket.on('history/updated',_id => {
      this.history.onUpdated(_id)
    })
   
    this.socketService.socket.on('history/newMessage',m => {
      this.history.onNewMessage(m)
    })
  
    this.socketService.socket.on('history/message',m =>{
      this.history.onMessage(m)
    })
  }


  ngOnDestroy(){
    this.socketService.socket.emit(
      'leave'
    )
  }
}

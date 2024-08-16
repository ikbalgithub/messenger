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

  
  storeService   = inject(StoreService)
  user           = this.storeService.user()
  requestService = inject(RequestService)
  router         = inject(Router)
  authService    = inject(AuthService)
  socket         = io(import.meta.env.NG_APP_SERVER)
  
  ngOnInit(){
    this.socket.on('connect',() => {
      this.socket.emit(
        'join',
        `history/${this.user._id}`
      )
    })

    this.socket.on('history/updated',(_id,cb) => {
      this.history.onUpdated(_id)
    })
   
    this.socket.on('history/newMessage',(m,cb) => {
      this.history.onNewMessage(m)
    })
  
    this.socket.on('history/message',(m,cb) =>{
      this.history.onMessage(m)
    })
  }


  ngOnDestroy(){
    this.socket.disconnect()
  }
}

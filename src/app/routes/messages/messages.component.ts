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

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [HistoryComponent,CommonModule,FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit, OnDestroy {
  @ViewChild('history') history !:HistoryComponent

  socket         = io(import.meta.env.NG_APP_SERVER)
  storeService   = inject(StoreService)
  user           = this.storeService.user()
  requestService = inject(RequestService)
  router         = inject(Router)
  authService    = inject(AuthService)
  
  ngOnInit(){
    this.socket.on('connect',() => {
      this.socket.emit(
        'join',
        `history/${this.user._id}`
      )
    })

    this.socket.on('history/updated',(_id,ack) => {
      this.history.onUpdated(_id)

      ack()
    })
   
    this.socket.on('history/newMessage',(data,ack) => {
      this.history.onNewMessage(data)

      ack()
    })
  
    this.socket.on('history/message',(m,ack) =>{
      this.history.onMessage(m)

      ack()
    })
  }


  ngOnDestroy(){
    this.socket.disconnect()
  }
}

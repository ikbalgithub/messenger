import { io } from 'socket.io-client'
import { Message } from '../../../index.d'
import { Component,OnInit,OnDestroy,inject,ViewChild } from '@angular/core';
import { StoreService } from '../../services/store/store.service'
import { HistoryComponent } from '../../components/history/history.component'


@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [HistoryComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit, OnDestroy {
  @ViewChild('history') history !:HistoryComponent

  socket       = io(import.meta.env.NG_APP_SERVER)
  storeService = inject(StoreService)
  user         = this.storeService.user()
  
  ngOnInit(){
    this.socket.on('connect',() => {
      this.socket.emit(
        'join',
        `history/${this.user._id}`
      )
    })

    this.socket.on('history/updated',_id => {
      this.history.onUpdated(_id)
    })
   
    this.socket.on('history/newMessage',data => {
      this.history.onNewMessage(data)
    })
  
    this.socket.on('history/message',m =>{
      this.history.onMessage(m)
    })
  }

  ngOnDestroy(){
    this.socket.disconnect()
  }
}

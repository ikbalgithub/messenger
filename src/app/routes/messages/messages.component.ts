import { io } from 'socket.io-client'
import { Message } from '../../../index.d'
import { Component,OnDestroy,inject,ViewChild } from '@angular/core';
import { StoreService } from '../../services/store/store.service'
import { HistoryComponent } from '../../components/history/history.component'


@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [HistoryComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnDestroy {
  socket       = io(import.meta.env.NG_APP_SERVER)
  storeService = inject(StoreService)
  user         = this.storeService.user()

  @ViewChild('appHistory') hC!:HistoryComponent
  
  onNewMessage = this.socket.on('history/newMessage',message => this.hC.onNewMessage(message))
  onMessage = this.socket.on('history/message',message => this.hC.onMessage(message))

  onConnected = this.socket.on('connect',() => {
    this.socket.emit(
      'join',
      `history/${this.user._id}`
    )
  })

  ngOnDestroy(){
    this.socket.disconnect()
  }
}

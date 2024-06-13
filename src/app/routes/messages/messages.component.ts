import { io } from 'socket.io-client'
import { CommonModule } from '@angular/common';
import { Component,OnInit,OnDestroy,inject,ViewChild } from '@angular/core';
import { StoreService } from '../../services/store/store.service'
import { HistoryComponent } from '../../components/history/history.component'
import { RequestService } from '../../services/request/request.service';
import { Ngrx, Search } from '../../..';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../guards/canDeactivate/can-deactivate.guard';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [HistoryComponent,CommonModule,FormsModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit, OnDestroy,CanComponentDeactivate {
  @ViewChild('history') history !:HistoryComponent
  consumerTag    = ''
  socket         = io(import.meta.env.NG_APP_SERVER)
  storeService   = inject(StoreService)
  user           = this.storeService.user()
  requestService = inject(RequestService)
  router         = inject(Router)
  
  ngOnInit(){
    this.socket.on('connect',() => {
      this.socket.emit(
        'join',
        `history/${this.user?._id}`
      )
    })

    this.socket.on('startedConsume',consumerTag => {
      this.consumerTag = consumerTag
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

  canDeactivate(){
    this.socket.disconnect()
    return true
  }

  ngOnDestroy(){
    this.socket.disconnect()
  }
}

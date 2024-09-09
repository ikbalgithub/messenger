import { io } from 'socket.io-client'
import { CommonModule } from '@angular/common';
import { Component,OnInit,OnDestroy,inject,ViewChild } from '@angular/core';
import { StoreService } from '../../services/store/store.service'
import { HistoryComponent } from '../../components/history/history.component'
import { RequestService } from '../../services/request/request.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
@Component({
  selector: 'app-messages',
  standalone: true,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  imports:[
    HistoryComponent,
    SidebarComponent,
    CommonModule,
    FormsModule,
    ButtonModule,
    AvatarModule,
    AvatarGroupModule,
  ],
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
      var params = {
        _id:this.user._id,
        paths:[`history/${this.user._id}`]
      }
      
      this.socket.emit(
        'join',
       params
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

    this.socket.on('ack',path => {
      this.socket.emit(
        'ack',path
      )
    })
  }


  ngOnDestroy(){
    this.socket.disconnect()
  }
}

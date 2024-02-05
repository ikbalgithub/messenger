import { Store } from '@ngrx/store'
import { io } from 'socket.io-client'
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'
import { getToken } from "firebase/messaging";
import { CommonModule } from '@angular/common';
import { Component,OnInit,OnDestroy,inject,Signal,signal,effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Ngrx,Message,Request } from '../../../index.d'
import { RequestService } from '../../services/request/request.service'
import { LastMessageComponent } from '../../components/last-message/last-message.component'
import { ProfilePipe } from '../../pipes/profile/profile.pipe'
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToStringPipe } from '../../pipes/toString/to-string.pipe'
import { AvatarModule } from 'primeng/avatar';
import { CommonService } from '../../services/common/common.service'
import { FirebaseService } from '../../services/firebase/firebase.service'
import { StoreService } from '../../services/store/store.service'
import { ButtonModule } from 'primeng/button';
import { NavbarComponent } from '../../components/navbar/navbar.component'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [
    AvatarModule,
    CommonModule,
    LastMessageComponent,
    ProfilePipe,
    ButtonModule,
    ProgressSpinnerModule,
    ToStringPipe,
    NavbarComponent
  ],
})
export class HomeComponent implements OnInit,OnDestroy{
  connected = false
  router = inject(Router)
  storeService = inject(StoreService)
  requestService = inject(RequestService)
  commonService = inject(CommonService)
  user = this.storeService.user
  hAuth = this.storeService.authorization

  socket = io(import.meta.env.NG_APP_SERVER)
 
  onNewMessage = this.socket.on('newMessage',(newMessage:Message.One) =>{
    var result = this.fetchState().result as Message.Last[]
    var JSONMessages = result.map(m => JSON.stringify(m))
    var [filter] = result.filter((message,index) => {
      return (
        message.sender.usersRef
        === newMessage.sender
      ) || (
        message.accept.usersRef
        === newMessage.sender
      )
    })

    if(filter){
      if(filter.sender.usersRef === String(newMessage.sender)){
        var counter = filter.unreadCounter + 1
        var index = JSONMessages.indexOf(
          JSON.stringify(filter)
        )

        result[index] = {
          ...newMessage,
          sender:filter.sender,
          accept:filter.sender,
          unreadCounter:counter
        }

        this.fetchState.update(current => {
          return {
            ...current,
            result
          }
        })
      }

      if(filter.sender.usersRef === String(newMessage.accept)){
        var index = JSONMessages.indexOf(
          JSON.stringify(filter)
        )

        result[index] = {
          ...newMessage,
          sender:filter.accept,
          accept:filter.sender,
          unreadCounter:1
        }

        this.fetchState.update(current => {
          return {
            ...current,
            result
          }
        })
      }
    }
  })

  onMessage = this.socket.on('message',(newMessage:Message.Populated) => {
    var messages = this.fetchState().result as Message.Last[]
    if(messages.filter(e => e._id === newMessage._id)?.length < 1){
      //if(newMessage.accept.usersRef === this.user._id){
        this.fetchState.update((current) => {
          var withCounter = {
            ...newMessage,
            unreadCounter:1
          }

          var result = [
            withCounter,
            ...messages,
          ]

          return {
            ...current,
            result
          }
        })
      //}
    }
  })

  onConnect = this.socket.on('connect',() => {
    this.connected = true

    this.socket.emit(
      'join',
      this.user()._id
    )
  })

  onDisconnected = this.socket.on('disconnect',() => {
    this.connected = false
  })

  fetchState = this.requestService.createInitialState<Message.Last[]>()

  fetchMessage = this.requestService.get<Message.Last[]>({
    state:this.fetchState,
    cb:r => console.log(r),
    failedCb: e => console.log(e)
  })

  ngOnInit(){
    var path = `message/recently`
    var headers = new HttpHeaders({
      authorization:this.hAuth()
    })

    this.fetchMessage(
      path,{headers}
    )
  }

  ngOnDestroy(){
    this.socket.disconnect()
  }

  retry(){
    (this.fetchState().retryFunction as Function)()
  }
}

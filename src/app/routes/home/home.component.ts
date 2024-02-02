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
import { SocketService } from '../../services/socket/socket.service'
import { ButtonModule } from 'primeng/button';

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
  ],
})
export class HomeComponent implements OnInit{
  connected = false
  router = inject(Router)
  storeService = inject(StoreService)
  requestService = inject(RequestService)
  commonService = inject(CommonService)
  socketService = inject(SocketService)
  store = inject(Store<Ngrx.State>)

  user = this.storeService.user
  authorization = this.storeService.authorization
  u = toSignal(this.store.select('user'))

  recentlyMessages = signal<Message.Last[]>([])
 
  onNewMessage = this.socketService.socket.on('newMessage',(newMessage:Message.One) =>{
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

  onMessage = this.socketService.socket.on('message',(newMessage:Message.Populated) => {
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

  onConnected = this.socketService.socket.on('connect',() => {
    this.connected = true

    this.socketService.socket.emit(
      'join',
      this.user._id
    )
  })

  onDisconnect = this.socketService.socket.on('disconnected',() => {
    this.connected = false
  })


  fetchState = this.requestService.createInitialState<Message.Last[]>()

  fetchMessage = this.requestService.get<Message.Last[]>({
    state:this.fetchState,
    cb:r => this.recentlyMessages.set(r),
    failedCb: e => console.log(e)
  })

  ngOnInit(){
    var path = `message/recently`
    var headers = new HttpHeaders({
      authorization:this.authorization
    })

    this.fetchMessage(
      path,{headers}
    )
  }

  retry(){
    (this.fetchState().retryFunction as Function)()
  }
}

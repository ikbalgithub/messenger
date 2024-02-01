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
    var result = this.fetchMessageState().result as Message.Last[]
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

    if(filter && newMessage.accept === this.user._id){
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

        this.fetchMessageState.update(current => {
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

        this.fetchMessageState.update(current => {
          return {
            ...current,
            result
          }
        })
      }
    }

    /*var _recentlyMessages = this.recentlyMessages()
    var [filter] = _recentlyMessages.filter(message => {
      return (
        message.sender.usersRef
        === newMessage.sender
      ) || (
        message.accept.usersRef
        === newMessage.sender
      )
    })
    

    if(filter && newMessage.accept === this.user._id){
      if(filter.sender.usersRef === String(newMessage.sender)){

        var counter = filter.unreadCounter + 1
        var index = _recentlyMessages.indexOf(
          filter
        )

        _recentlyMessages[index] = {
          ...newMessage,
          sender:filter.sender,
          accept:filter.accept,
          unreadCounter:counter
        }

        this.recentlyMessages.set(
          _recentlyMessages
        )
      }
      if(filter.sender.usersRef === String(newMessage.accept)){
        var index = _recentlyMessages.indexOf(
          filter
        )
        _recentlyMessages[index] = {
          ...newMessage,
          sender:filter.accept,
          accept:filter.sender,
          unreadCounter:1
        }

        this.recentlyMessages.set(
          _recentlyMessages
        )
      }
    }
    else{
      console.log('not on list')
    }*/
  })

  onMessage = this.socketService.socket.on('message',(newMessage:Message.Populated) => {
    var messages = this.fetchMessageState().result as Message.Last[]
    if(messages.filter(e => e._id === newMessage._id)?.length < 1){
      if(newMessage.accept.usersRef === this.user._id){
        this.fetchMessageState.update((current) => {
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
      }
    }

    /*
    if(this.recentlyMessages().filter(e => e._id === newMessage._id).length < 1){
      if(newMessage.accept.usersRef === this.user._id){
        this.recentlyMessages.update((current) => {
          var withCounter = {
            ...newMessage,
            unreadCounter:1
          }

          return [
            withCounter,
            ...current
          ]
        })
      }
    }
    else{
      console.log('has been on list')
    }
    */
  })


  fetchMessageState = this.requestService.createInitialState<Message.Last[]>()

  fetchMessage = this.requestService.get<Message.Last[]>({
    state:this.fetchMessageState,
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
    (this.fetchMessageState().retryFunction as Function)()
  }
}

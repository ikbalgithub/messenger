import { Store } from '@ngrx/store'
import { Types } from 'mongoose';
import { io } from 'socket.io-client'
import { Component,OnInit,OnDestroy,inject,signal,effect } from '@angular/core';
import { Common } from '../../../index.d'
import { ActivatedRoute,Router,Params } from '@angular/router'
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CommonModule,Location } from '@angular/common';
import { Message,Ngrx } from '../../../index.d'
import { RequestService } from '../../services/request/request.service'
import { StoreService } from '../../services/store/store.service'
import { HttpHeaders } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputGroupModule } from 'primeng/inputgroup';
import { FormControl,FormGroup, ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-message',
  standalone: true,
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
  imports: [
    AvatarModule,
    ButtonModule,
    ProgressSpinnerModule,
    CommonModule,
    InputGroupModule,
    ReactiveFormsModule
  ]
})
export class MessageComponent implements OnInit,OnDestroy {

  connected = false
  router   = inject(Router)
  route    = inject(ActivatedRoute)
  location = inject(Location)
  request  = inject(RequestService)
  storeService    = inject(StoreService)  
  socket = io(import.meta.env.NG_APP_SERVER)

  user = this.storeService.user
  routeState = window.history.state
  _id = this.route.snapshot.params['_id']
  hAuth = this.storeService.authorization

  /**
   * fetch all message result
   */
  
  //messages = signal<Message.All>([])
  
  /**
   * new message form
   */

  newMessage:FormGroup = new FormGroup({
    value:new FormControl<string>(''),
    groupId:new FormControl<string>(
      this.routeState.groupId
    ),
    accept:new FormControl<string>(
      this._id
    )
  })

  /**
   * request state and function
   */

  fetchState = this.request.createInitialState<Message.All>()
  sendMessageState = this.request.createInitialState<Message.One>()
  updateOnReadState = this.request.createInitialState<Message.One>()

  sendNewMessage = this.request.post<Message.New,Message.One>({
    cb:r => this.onSuccessSend(r._id),
    failedCb:r => console.log(r),
    state:this.sendMessageState,
    path:'message'
  })

  fetch = this.request.get<Message.All>({
    cb:r => this.onSuccessFetch(r),
    failedCb: e => console.log(e),
    state:this.fetchState,
  })

  updateOnReadFn = this.request.put<Message.Update,Message.One>({
    cb:r => console.log(r),
    failedCb:r => console.log(r),
    state:this.updateOnReadState,
    path:'message'
  })

  /**
   * implements on init
   */

  ngOnInit(path = `message/all/${this._id}`){
    var headers = new HttpHeaders({
      authorization:this.hAuth()
    })

    this.fetch(path,{
      headers
    })
  }

  ngOnDestroy(){
    this.socket.disconnect()
  }
  
  /**
   * is valid current message input
   */

  isValid(message:string):boolean{
    var regex = /^\s*$/;
    return regex.test(
      message
    ) 
  }

  /**
   * - add new message to message list
   * - trigger send message http function
   */

  send(now = Date.now(),_id = new Types.ObjectId()){
    var newMessage:Message.One = {
      ...this.newMessage.value,
      sender:this.user()._id,
      _id:_id.toString(),
      sendAt:now,
      sent:false,
      read:false,
      contentType:'',
      description:'',
    }

    var sendObject:Message.New = {
      ...this.newMessage.value,
      _id:_id.toString(),
      sendAt:now
    }

    this.fetchState.update(current => {
      var result = [
        ...current.result,
        newMessage
      ]

      return {
        ...current,
        result
      }
    })

    var headers = new HttpHeaders({
      authorization:this.hAuth()
    })

    this.sendNewMessage(
      sendObject,
      {headers}
    )
  }

  /**
   * update message status on sent
   */

  onSuccessSend(_id:string){
    var result = this.fetchState().result
    var JSONResult = result.map(m => {
      return JSON.stringify(m)
    })

    var [filter] = result.filter(f => {
      return f._id === _id
    })

    var index = JSONResult.indexOf(
      JSON.stringify(filter)
    )

    result[index] = {
      ...filter,
      sent:true
    }

    this.fetchState.update(
      current => ({
        ...current,
        result
      })
    )
  }

  onSuccessFetch(messages:Message.All){
    var result = messages.map(
      message => ({
        ...message,
        sent:true
      })
    )

    messages.filter(
      x => 
        x.read === false &&
        x.sender === this._id
    )
    .map(
      message => {
        this.updateOnReadFn({
          _id:message._id
        })
      }
    )

    setTimeout(() => {
      this.fetchState.update(
        current => ({
          ...current,
          result
        })
      )
    })
  }

  onNewMessage = this.socket.on('newMessage',(message:Message.One) => {
    this.updateOnReadFn({_id:message._id})
    this.fetchState.update(current => {
      var newMessage = {
        ...message,
        sent:true,
        read:true
      }
      var result = [
        ...current.result,
        newMessage
      ]
      return {
        ...current,
        result
      }
    })
  })
  

  onUpdated = this.socket.on('updated',(_id:string) => {
    var result = this.fetchState().result
    var JSONResult = result.map(m => {
      return JSON.stringify(m)
    })

    var [filter] = result.filter(m => {
      return _id === m._id
    })

    var index = JSONResult.indexOf(
      JSON.stringify(filter)
    )

    result[index] = {
      ...filter,
      read:true
    }

    this.fetchState.update(
      current => ({
      	...current,
      	result
      })
    )
  })

  onConnect = this.socket.on('connect',() => {
    var _id = this.user()._id
    var groupId = this.routeState.groupId
    var roomId = `${groupId}/${_id}`

    this.connected = true

    this.socket.emit(
      'join',
      roomId
    )
  })

  onDisconnect = this.socket.on('disconnect',() => {
  	this.connected = false
  })

  retry(){
    (this.fetchState().retryFunction as Function)()
  }
}

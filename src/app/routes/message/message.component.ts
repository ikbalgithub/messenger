import { Store } from '@ngrx/store'
import { Types } from 'mongoose';
import { io } from 'socket.io-client'
import { Component,OnInit,OnDestroy,inject,signal } from '@angular/core';
import { Common } from '../../../index.d'
import { ActivatedRoute,Router,Params } from '@angular/router'
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CommonModule,Location,ViewportScroller } from '@angular/common';
import { Message,Ngrx } from '../../../index.d'
import { RequestService } from '../../services/request/request.service'
import { StoreService } from '../../services/store/store.service'
import { HttpHeaders } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputGroupModule } from 'primeng/inputgroup';
import { FormControl,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SendMessageComponent } from '../../components/send-message/send-message.component'
import { MessageAcceptComponent } from '../../components/message-accept/message-accept.component'
import { MessageSentComponent } from '../../components/message-sent/message-sent.component'
import { NavbarComponent } from '../../components/navbar/navbar.component'
import { MessagesComponent } from '../../components/messages/messages.component'
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FirebaseService } from '../../services/firebase/firebase.service'
import { ref,uploadBytes,getDownloadURL } from 'firebase/storage'

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
    ReactiveFormsModule,
    SendMessageComponent,
    MessageAcceptComponent,
    MessageSentComponent,
    NavbarComponent,
    MessagesComponent,
    DialogModule,
    InputTextModule
  ]
})
export class MessageComponent implements OnInit,OnDestroy {

  connected = false
  visible   = false
  isValid   = /^\s*$/;
  uploading = false
  router    = inject(Router)
  route     = inject(ActivatedRoute)
  location  = inject(Location)
  scroller  = inject(ViewportScroller)
  request   = inject(RequestService)
  storeService = inject(StoreService)
  firebaseService = inject(FirebaseService)
  socket = io(import.meta.env.NG_APP_SERVER)

  user = this.storeService.user
  routeState = window.history.state
  _id = this.route.snapshot.params['_id']
  hAuth = this.storeService.authorization
  storage = this.firebaseService.storage

  newMessage:FormGroup = new FormGroup({
    value:new FormControl<string>(''),
    groupId:new FormControl<string>(
      this.routeState.groupId
    ),
    accept:new FormControl<string>(
      this._id
    )
  })

  imageMessage:FormGroup = new FormGroup({
    description:new FormControl<string>(''),
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
  sendState = this.request.createInitialState<Message.One>()
  updateOnReadState = this.request.createInitialState<Message.One>()

  requestSend = this.request.post<Message.New,Message.One>({
    failedCb:(error,body) => {
      var postObject = body as Message.New
      var result = this.fetchState().result
      var JSONResult = result.map(m => {
        return JSON.stringify(m)
      })

      var [filter] = result.filter(f => {
        return f._id === postObject._id
      })

      var index = JSONResult.indexOf(
        JSON.stringify(filter)
      )

      result[index] = {
        ...filter,
        failed:true
      }
      
      this.fetchState.update(
        current => ({
          ...current,
          result
        })
      )
    },
    cb:r => this.onSuccessSend(r._id),
    state:this.sendState,
    path:'message'
  })

  requestFetch = this.request.get<Message.All>({
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

    this.requestFetch(
      path,
      {headers}
    )
  }

  ngOnDestroy(){
    this.socket.disconnect()
  }

  sendImage(form:FormGroup,now = Date.now(),_id = new Types.ObjectId()){
    var newMessage:Message.One = {
      ...form.value,
      sender:this.user()._id,
      _id:_id.toString(),
      sendAt:now,
      sent:false,
      read:false,
      contentType:'image',
    }

    var sendObject:Message.New = {
      ...form.value,
      contentType:'image',
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

    setTimeout(() => {
      this.scrollToBottom()
    })
    

    var headers = new HttpHeaders({
      authorization:this.hAuth()
    })

    this.requestSend(
      sendObject,
      {headers}
    )

    this.visible = false

  }

  send(form:FormGroup,now = Date.now(),_id = new Types.ObjectId()){
    var newMessage:Message.One = {
      ...form.value,
      sender:this.user()._id,
      _id:_id.toString(),
      sendAt:now,
      sent:false,
      read:false,
      contentType:'text',
      description:'none',
    }

    var sendObject = {
      ...form.value,
      _id:_id.toString(),
      contentType:'text',
      description:'none',
      sendAt:now
    }

    this.scroller.scrollToAnchor("anchor")

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

    setTimeout(() => {
      this.scrollToBottom()
    })
  

    var headers = new HttpHeaders({
      authorization:this.hAuth()
    })

    this.requestSend(
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
      sent:true,
      failed:false
    }

    this.fetchState.update(
      current => ({
        ...current,
        result
      })
    )
  }

  onSuccessFetch(messages:Message.All){
    var _id = this._id
    var groupId = this.routeState.groupId
    var roomId = `${groupId}/${_id}`

    this.updateOnReadFn({groupId,_id})

    var result = messages.map(
      message => ({
        ...message,
        sent:true
      })
    )

    var sortedResult = result.sort((a,b) => {
      return a.sendAt > b.sendAt ? 1 : -1
    })

    setTimeout(() => {
      this.fetchState.update(
        current => ({
          ...current,
          result
        })
      )
    })
  }

  onNewMessage = this.socket.on('incomingMessage',(message:Message.One) => {
    var _id = this._id
    var groupId = this.routeState.groupId
    var roomId = `${groupId}/${_id}`

    this.updateOnReadFn({groupId,_id})
    
    var result = this.fetchState().result
    
    var newMessage = {
      ...message,
      sent:true,
      read:true
    }

    var sortedResult = [...result,newMessage].sort(
      (a,b) => a.sendAt > b.sendAt ? 1 : -1
    )

    this.fetchState.update(current => {
      return {
        ...current,
        result:[...sortedResult]
      }
    })

    setTimeout(() => {
      this.scrollToBottom()
    },2000)

  })
  

  onUpdated = this.socket.on('updated',() => {
    var result = this.fetchState().result

    var newResult = result.map((m) => {
      return {
        ...m,
        read:true
      }
    })

    this.fetchState.update((current) => {
      return {
        ...current,
        result:newResult
      }
    })
  })

  onConnect = this.socket.on('connect',() => {
    this.socket.emit(
      'join',
      `${this.routeState.groupId}/${this.user()._id}`
    )
    
    this.socket.emit(
      'join',
      `chat/${this.user()._id}/${this.route.snapshot.params['_id']}`
    )
  })

  onDisconnect = this.socket.on('disconnect',() => {
  	this.connected = false
  })

  async upload(file:File){
    try{
      this.uploading = true
      var uploadRef = `send/${Date.now()}`
      var refs = ref(this.storage,uploadRef)
      var result = await uploadBytes(refs,file)
      var url = await getDownloadURL(result.ref)
      
      this.imageMessage.patchValue({
        ...this.imageMessage.value,
        value:url
      })

      this.visible = true
    }
    catch(err:any){
      console.log(err.message)
    }
    finally{
      this.uploading = false
    }
  }

  retry(){
    (this.fetchState().retryFunction as Function)()
  }

  resend({read,...message}:Message.One){
    var headers = new HttpHeaders({
      authorization:this.hAuth()
    })

    this.requestSend(
      message,
      {headers}
    )
  }

  scrollToBottom(){
    this.scroller.scrollToAnchor("anchor")
  }
}

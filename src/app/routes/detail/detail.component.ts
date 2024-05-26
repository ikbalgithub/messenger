import { io } from 'socket.io-client'
import { Types } from 'mongoose';
import { ImageModule } from 'primeng/image';
import { CommonModule,ViewportScroller } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Component,ViewChild,inject,OnInit,OnDestroy,OnChanges,Input } from '@angular/core';
import { HistoryComponent } from '../../components/history/history.component'
import { CommonService } from '../../services/common/common.service'
import { StoreService } from '../../services/store/store.service'
import { FirebaseService } from '../../services/firebase/firebase.service'
import { RequestService } from '../../services/request/request.service'
import { Message } from '../../../index.d'
import { ActivatedRoute,Router,Params } from '@angular/router'
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormControl,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { ref,uploadBytes,getDownloadURL } from 'firebase/storage'

@Component({
  selector: 'app-detail',
  standalone: true,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
  imports: [
    HistoryComponent,
    ProgressSpinnerModule,
    AvatarModule,
    CommonModule,
    ImageModule,
    InputGroupModule,
    ButtonModule,
    ReactiveFormsModule,
    DialogModule
  ]
})
export class DetailComponent implements OnInit,OnDestroy {
  isValid         = /^\s*$/
  preview         = false
  uploading       = false
  connected       = false
  env             = import.meta.env
  router          = inject(Router)
  scroller        = inject(ViewportScroller)
  commonService   = inject(CommonService)
  storeService    = inject(StoreService)
  route           = inject(ActivatedRoute)
  requestService  = inject(RequestService)
  firebaseService = inject(FirebaseService)
  user            = this.storeService.user()
  routeState      = window.history.state
  authorization   = this.storeService.authorization()
  storage         = this.firebaseService.storage
  _id             = this.route.snapshot.params['_id']
  
  socket = io(this.env.NG_APP_SERVER,{autoConnect:false})

  
  @ViewChild('appHistory') appHistory!:HistoryComponent


  fetchState = this.requestService.createInitialState<Message.All>()
  sendState = this.requestService.createInitialState<Message.One>()
  updateState = this.requestService.createInitialState<Message.One>()

  updateRequest = this.requestService.put<Message.Update,Message.One>({
    cb:r => console.log(r),
    failedCb:r => console.log(r),
    state:this.updateState,
    path:'message'
  })

  sendRequest = this.requestService.post<Message.New,Message.One>({
    failedCb:err => console.log(err),
    cb:r => this.onSuccessSend(r._id),
    state:this.sendState,
    path:'message'
  })

  fetchRequest = this.requestService.get<Message.All>({
    cb:messages => {
      this.routeState.groupId = messages[0].groupId
      
      this.updateRequest({
        groupId:this.routeState.groupId,
        _id:this.route.snapshot.params['_id']
      })

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

      this.socket.connect()

    },
    failedCb:err => console.log(err),
    state:this.fetchState
  })

  txtMessage = new FormGroup({
    value: new FormControl<string>(''),
    description: new FormControl<string>('none'),
    groupId: new FormControl<string>(this.routeState.groupId),
    sender: new FormControl<string>(this.user._id),
    contentType: new FormControl<string>('text'),
    accept:new FormControl<string>(this.route.snapshot.params['_id'])
  })

  imgMessage = new FormGroup({
    description:new FormControl<string>(''),
    value:new FormControl<string>(''),
    groupId:new FormControl<string>(
      this.routeState.groupId
    ),
    accept:new FormControl<string>(
      this.route.snapshot.params[
        '_id'
      ]
    )
  })

  sendTextMessage(form:FormGroup,authorization:string){
    var now = Date.now()
    var sender = this.user._id
    var _id = new Types.ObjectId().toString()
    var headers = new HttpHeaders({authorization})

    var newMessage = {
      ...form.value,
      sendAt:now,
      sent:false,
      read:false,
      _id,
    }

    var sendObject = {
      ...form.value,
      sendAt:now,
      _id
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

    setTimeout(() => this.toAnchor())

    this.appHistory.onSendMessage(newMessage)


    this.sendRequest(
      sendObject,
      {headers}
    )
  }

  sendImage(form:FormGroup,authorization:string,now = Date.now(),_id = new Types.ObjectId()){
    var headers = new HttpHeaders({authorization})

    var newMessage:Message.One = {
      ...form.value,
      sender:this.user._id,
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

    this.appHistory.onSendMessage(newMessage)

    setTimeout(() => this.toAnchor())

    this.sendRequest(
      sendObject,
      {headers}
    )

    this.preview = false
  }

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

    setTimeout(() => this.toAnchor())

  

    this.fetchState.update(
      current => ({
        ...current,
        result
      })
    )
  }

  onNewMessage = this.socket.on('history/newMessage',message => {
    this.appHistory.onNewMessage(message)
  })

  onMessage = this.socket.on('history/message',message => {
    this.appHistory.onMessage(message)
  })

  onIncomingMessage = this.socket.on('incomingMessage',m => {
    var _id = this._id
    var groupId = this.routeState.groupId
    var roomId = `${groupId}/${_id}`

    this.updateRequest({groupId,_id})
    
    var result = this.fetchState().result
    
    var newMessage = {
      ...m,
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
    
    setTimeout(() => this.toAnchor(),2000)
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

  onDisconnected = this.socket.on('disconnect',() => {
    this.connected = false
  })

  onConnected = this.socket.on('connect',() => {
    var snapshot = this.route.snapshot
    var groupId  = this.routeState.groupId
    var _id      = snapshot.params['_id']

    this.connected = true

    this.socket.emit(
      'join',
      `history/${this.user._id}`
    )

    this.socket.emit(
      'join',
      `chat/${this.user._id}/${_id}`
    )

    this.socket.emit(
      'join',
      `${groupId}/${this.user._id}`
    )
  })

  async onFileChange(event:any){
    try{
      this.uploading = true
      var file = event.target.files[0]
      var uploadRef = `send/${Date.now()}`
      var refs = ref(this.storage,uploadRef)
      var result = await uploadBytes(refs,file)
      var url = await getDownloadURL(result.ref)

      this.imgMessage.patchValue({
        ...this.imgMessage.value,
        value:url
      })

      this.preview = true
    }
    catch(err:any){
      console.log(err.message)
    }
    finally{
      this.uploading = false
    }
  }

  toAnchor(){
    this.scroller.scrollToAnchor(
      "anchor"
    )
  }

  ngOnInit(){
    this.routeState.test = true
    this.route.url.subscribe((url) => {
      var authorization = this.authorization
      var headers = new HttpHeaders({authorization})
      var fetchId = this.route.snapshot.params['_id']

      if(this.connected) this.socket.disconnect()

      this.fetchRequest(`message/all/${fetchId}`,{headers})
    })

  }

  ngOnDestroy(){
    this.socket.disconnect()
  }

}

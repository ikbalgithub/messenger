import { io } from 'socket.io-client'
import { Types } from 'mongoose';
import { Subscription } from 'rxjs'
import { ImageModule } from 'primeng/image';
import { CommonModule,ViewportScroller } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Component,ViewChild,inject,OnInit,OnDestroy,HostListener, signal, computed } from '@angular/core';
import { HistoryComponent } from '../../components/history/history.component'
import { CommonService } from '../../services/common/common.service'
import { StoreService } from '../../services/store/store.service'
import { FirebaseService } from '../../services/firebase/firebase.service'
import { RequestService } from '../../services/request/request.service'
import { Message,Common } from '../../../index.d'
import { ActivatedRoute,Router,Params } from '@angular/router'
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormControl,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { ref,uploadBytes,getDownloadURL } from 'firebase/storage'
import { add, failedSend, init, resend, successSend, updated } from '../../ngrx/actions/messages.actions';
import { FilterPipe } from '../../pipes/filter/filter.pipe';
import { threadId } from 'worker_threads';

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
    DialogModule,
    FilterPipe
  ]
})
export class DetailComponent implements OnInit,OnDestroy {
  preview           = false
  connected         = false
  uploading         = false
	isValid           = /^\s*$/
  internetConnected = true
  url:RSU           = undefined
  scroller          = inject(ViewportScroller)
  route             = inject(ActivatedRoute)
  firebaseService   = inject(FirebaseService)
  requestService    = inject(RequestService)
  storeService      = inject(StoreService)
  commonService     = inject(CommonService)
  storage           = this.firebaseService.storage
  parameterId       = this.route.snapshot.params['_id']
  user              = this.storeService.user() as User
  authorization     = this.storeService.authorization()
  messages          = this.storeService.messages
  currentUser       = signal<string>(this.parameterId)
  routeState        = signal<WHS>(window.history.state)
  pathX             = `chat/${this.user._id}`
  path1             = `history/${this.user._id}`
  
  @ViewChild('history') history !:HistoryComponent
  socket         = io(import.meta.env.NG_APP_SERVER,{autoConnect:false})
  path2          = computed(() => `${this.pathX}/${this.currentUser()}`)
  updateState    = this.requestService.createInitialState<Message.One>()
  fetchState     = this.requestService.createInitialState<Message.All>()
	sendState      = this.requestService.createInitialState<Message.One>()
  path3          = `${this.routeState().groupId}/${this.user._id}`

  messageForm:FormGroup = new FormGroup({
    value: new FormControl<string>(''),
    sender:new FormControl<string>(this.user._id),
    description: new FormControl<string>('none'),
    contentType: new FormControl<string>('text'),
  })

  imageForm = new FormGroup({
    value: new FormControl<string>(''),
    description: new FormControl<string>('none'),
    contentType: new FormControl<string>('image'),
    sender: new FormControl<string>(this.user._id),
  })

  additionalInfo = computed(() => {
    var state = this.routeState()
    

    return {
      accept:this.currentUser(),
      groupId:state.groupId
    }
  })

  updateRequest = this.requestService.put<Message.Update,Message.One>({
    cb:r => {
      this.history.resetCounter(
        this.route.snapshot.params['_id']
      )
    },
    failedCb:r => console.log(r),
    state:this.updateState,
    path:'message'
  })

	sendRequest = this.requestService.post<Message.New,Message.One>({
    failedCb:(err,body) => {
      var postObject = body as Message.New

      var index = this.messages().findIndex(
        m => m._id === this.currentUser()
      )

      this.storeService.store.dispatch(
        failedSend(
          {
            index,
            _id:postObject._id
          }
        )
      )

      this.history.onFailedSend(
        postObject._id
      )
    },
    cb:r => {
      var index = this.messages().findIndex(
        m => m._id === this.currentUser()
      )

      this.storeService.store.dispatch(
        successSend(
          {
            index,
            _id:r._id
          }
        )
      )

      this.history.onSuccessSend(
        r._id
      )
    },
    state:this.sendState,
    path:'message'
  })


  fetchRequest = this.requestService.get<Message.All>({
    failedCb:r => alert(JSON.stringify(r)),
    cb: result => {
      if(result.length > 0){
        this.updateRequest(
          {
            groupId:this.routeState().groupId,
            _id:this.currentUser()
          },
          {
            headers:new HttpHeaders({
              authorization:this.authorization
            })
          }
        )
      }

      if(this.messages().filter(m => m._id === this.currentUser()).length < 1){
        this.storeService.store.dispatch(
          init(
            {
              _id:this.currentUser(),
              detail:result.map(m => {
                return {
                  ...m,
                  sent:true
                }
              })
            }
          )
        )
      }

      setTimeout(() => this.toAnchor("anchor2"))
     
      if(!this.socket.connected) this.socket.connect()
      
    },
    state:this.fetchState,
  })

  sendMessage(formulire:FormGroup,authorization:string){
    var _id = new Types.ObjectId().toString()
    var headers = new HttpHeaders({authorization})
    
    var index = this.messages().findIndex(m => {
      return m._id === this.currentUser()
    })

    var newMessage:Message.One = {
      ...formulire.value,
      ...this.additionalInfo(),
      sendAt:Date.now(),
      sent:false,
      read:false,
      _id,
    }
    
    var {sent,read,...sentObject} = newMessage

    this.storeService.store.dispatch(
      add(
        {
          index,
          newMessage
        }
      )
    )
    
    this.history.onSendMessage(
      newMessage,
      this.currentUser(),
      this.routeState().profile
    )
    
    this.imageForm.patchValue({
      value:'',
      ...formulire.value,
    })

    this.messageForm.patchValue({
      value:'',
      ...formulire.value,
    })

    this.sendRequest(
      sentObject,
      {headers}
    )

    if(this.preview){
      this.preview = false
    }

    setTimeout(() => {
      this.toAnchor("anchor")
    })
  }

  async onFileChange(event:any){
    try{
      this.uploading = true
      var file = event.target.files[0]
      var uploadRef = `send/${Date.now()}`
      var refs = ref(this.storage,uploadRef)
      var result = await uploadBytes(refs,file)
      var url = await getDownloadURL(result.ref)
      var formValue = this.imageForm.value

       this.imageForm.patchValue({
        ...formValue,
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

  toAnchor(anchor:string){
    this.scroller.scrollToAnchor(anchor)
  }

  reset(){
    this.messageForm.patchValue(
      {
        ...this.messageForm.value,
        value:''
      }
    )
  }

  resend({read,failed,sent,...message}:Message.One,authorization:string){
    var headers = new HttpHeaders({authorization})

    var index = this.messages().findIndex(m => {
      return m._id === this.currentUser()
    })

    this.storeService.store.dispatch(
      resend(
        {
          index,
          _id:message._id
        }
      )
    )

    this.history.onResend(
      message._id
    )
    
    this.sendRequest(
      {...message},
      {headers}
    )
  }

  @HostListener('window:offline',['$event']) onDisconnect(event:Event){
  	this.internetConnected = false
  }

  @HostListener('window:online',['$event']) onConnected(event:Event){
  	this.internetConnected = true
  }

  ngOnInit(){
    this.url = this.route.url.subscribe(c => {   
      var headers = new HttpHeaders({authorization:this.authorization})
      if(this.route.snapshot.params['_id'] !== this.currentUser()){
        this.currentUser.set(this.route.snapshot.params['_id'])
        this.routeState.set(window.history.state)
        var path = `message/all/${this.currentUser()}`
        var newGroupId = this.routeState().groupId
       
        this.path3 = `${newGroupId}/${this.user._id}`
        
        this.socket.disconnect()

        this.fetchRequest(
          path,{headers}
        )
      }
      else{
        var path = `message/all/${this.currentUser()}`

        this.fetchRequest(
          path,{headers}
        )
      }
    })

    
    this.socket.on('history/updated',(_id:string) => {
      this.history.onUpdated(_id)
    })
    

    this.socket.on('updated',(_id:string) => {
      var index = this.messages().findIndex(m => {
        return m._id === this.currentUser()
      })

      this.storeService.store.dispatch(
        updated(
          {
            index,
            _id:this.user._id
          }
        )
      )

      this.history.onUpdated(_id)
    })
    
    this.socket.on('incomingMessage',message => {      
      var [{detail}] = this.messages().filter(
        m => m._id === this.currentUser()
      )

      var [filter] = detail.filter(m => {
        return m._id === message._id
      })

      var index = this.messages().findIndex(
        m => m._id === this.currentUser()
      )
      
      this.updateRequest(
        {
          groupId:this.routeState().groupId,
          _id:this.currentUser()
        },
        {
          headers:new HttpHeaders({
            authorization:this.authorization
          })
        }
      )

      var newMessage = {
        ...message,
        sent:true,
        read:true
      }
  
      if(!filter){
        this.storeService.store.dispatch(
          add(
            {
              index,
              newMessage
            }
          )
        )

        setTimeout(() => {
          this.toAnchor("anchor")
        })
      }
    })
    
    this.socket.on('history/message',m => {
      this.history.onMessage(m)
    })

    this.socket.on('history/newMessage',m => {
      this.history.onNewMessage(m)
    }) 

    this.socket.on('connect',() => {      
      this.socket.emit(
        'join',
        this.path1
      )
      
      this.socket.emit(
        'join',
        this.path2()
      )
      
      this.socket.emit(
        'join',
         this.path3
      )
    })
  }

  ngOnDestroy(){
    (this.url as Subscription).unsubscribe()
    this.socket.disconnect()
  }
}


interface WHS{
  groupId:string,
  profile:Common.Profile
}

type User = Common.User
type RSU = Subscription|undefined
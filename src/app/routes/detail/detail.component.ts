import { io } from 'socket.io-client'
import { Types } from 'mongoose';
import { Subscription } from 'rxjs'
import { ImageModule } from 'primeng/image';
import { CommonModule,ViewportScroller } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Component,ViewChild,inject,OnInit,OnDestroy,HostListener } from '@angular/core';
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
  ]
})
export class DetailComponent implements OnInit,OnDestroy {
  @ViewChild('history') history !:HistoryComponent
  
  preview         = false
  connected       = false
  uploading       = false
	isValid         = /^\s*$/
  internetConnected = true
  routeState      = window.history.state
  scroller        = inject(ViewportScroller)
  route           = inject(ActivatedRoute)
  firebaseService = inject(FirebaseService)
  requestService  = inject(RequestService)
  storeService    = inject(StoreService)
  commonService   = inject(CommonService)
  storage         = this.firebaseService.storage
  user            = this.storeService.user() as Common.User
  authorization   = this.storeService.authorization()
  socket          = io(import.meta.env.NG_APP_SERVER,{autoConnect:false})
  currentUser     = this.route.snapshot.params['_id']


  routeUrlSubscription !: Subscription

  updateState    = this.requestService.createInitialState<Message.One>()
  fetchState     = this.requestService.createInitialState<Message.All>()
	sendState = this.requestService.createInitialState<Message.One>()

  credentialForm = new FormGroup({
    sender: new FormControl<string>(this.user._id),
    accept: new FormControl<string>(this.route.snapshot.params['_id']),
    groupId: new FormControl<string>(this.routeState.groupId)
  })

  messageForm:FormGroup = new FormGroup({
    value: new FormControl<string>(''),
    description: new FormControl<string>('none'),
    contentType: new FormControl<string>('text'),
  })

  imageForm = new FormGroup({
    value: new FormControl<string>(''),
    description: new FormControl<string>('none'),
    contentType: new FormControl<string>('image'),
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

      this.history.onFailedSend(postObject._id)

      result[index] = {
        ...filter,
        failed:true
      }
    },
    cb:r => {
      var result = this.fetchState().result
      var JSONResult = result.map(m => {
        return JSON.stringify(m)
      })
  
      var [filter] = result.filter(f => {
        return f._id === r. _id
      })
  
      var index = JSONResult.indexOf(
        JSON.stringify(filter)
      )

      result[index] = {
        ...filter,
        sent:true,
        failed:false
      }

      this.history.onSuccessSend(
        r._id
      )

      setTimeout(() => {
        this.fetchState.update(c => {
          return {
            ...c,
            result
          }
        })
      })
    },
    state:this.sendState,
    path:'message'
  })


  fetchRequest = this.requestService.get<Message.All>({
    failedCb:r => alert(JSON.stringify(r)),
    cb: result => {
      var authorization = this.authorization
      var snapshot = this.route.snapshot
      var paramsId = snapshot.params['_id']
      
			this.credentialForm.patchValue({
				...this.credentialForm.value,
				accept:this.route.snapshot.params['_id'],
				groupId:this.routeState.groupId
			})

      if(result.length > 0){
        this.updateRequest(
          {
            groupId:this.routeState.groupId,
            _id:paramsId
          },
          {
            headers:new HttpHeaders({
              authorization
            })
          }
        )
      }
      
      setTimeout(() => {
        this.fetchState.update((current) => {
          var result = current.result.map(m => {
            return {
              ...m,
              sent:true
            }
          })

          return {
            ...current,
            result
          }
        })

        setTimeout(() => this.toAnchor("anchor2"))
      })

      this.socket.connect()
    },
    state:this.fetchState,
  })

  sendMessage(form:FormGroup,authorization:string){
    var now = Date.now()
    var sender = {usersRef:this.user._id}
    var accept = {usersRef:this.route.snapshot.params['_id']}
    var _id = new Types.ObjectId().toString()
    var headers = new HttpHeaders({authorization})
    
		var newMessage = {
      ...form.value,
      sendAt:now,
      sent:false,
      read:false,
      sender,
      accept,
      _id,
    }

    var sendObject = {
      ...form.value,
      ...this.credentialForm.value,
      sendAt:now,
      _id
    }
    
    setTimeout(() => {
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

      this.preview = false
      setTimeout(() => this.toAnchor("anchor"))
		})

    this.imageForm.patchValue({
      ...this.imageForm.value,
      value:'',
    })

    this.messageForm.patchValue({
      ...this.messageForm.value,
      value:''
    })

    this.history.onSendMessage(
			newMessage,
			this.route.snapshot.params['_id'],
      this.routeState.profile
	  )

    this.sendRequest(
      sendObject,
      {headers}
    )
    
  }

  async onFileChange(event:any,form:FormGroup){
    try{
      this.uploading = true
      var file = event.target.files[0]
      var uploadRef = `send/${Date.now()}`
      var refs = ref(this.storage,uploadRef)
      var result = await uploadBytes(refs,file)
      var url = await getDownloadURL(result.ref)

      this.imageForm.patchValue({
        ...form,
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

    var result = this.fetchState().result
    var JSONResult = result.map(m => {
      return JSON.stringify(m)
    })

    var [filter] = result.filter(f => {
      return f._id === message._id
    })

    var index = JSONResult.indexOf(
      JSON.stringify(filter)
    )

    result[index] = {
      ...filter,
      failed:false
    }
    
    setTimeout(() => {
      this.fetchState.update(current => {
        return {
          ...current,
          result
        }
      })

      this.history.onResend(message._id)
    })

    var sendObject = {
      ...message,
      sender:message.sender.usersRef,
      accept:message.accept.usersRef as string,
      groupId:this.routeState.groupId
    }

    this.sendRequest(
      sendObject,
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
    this.routeUrlSubscription = this.route.url.subscribe((currentUrl) => {    
      if(this.route.snapshot.params['_id'] !== this.currentUser){
        this.currentUser = this.route.snapshot.params['_id']
        this.routeState = window.history.state
      }


      var headers = new HttpHeaders({authorization:this.authorization})
      var path = `message/all/${this.route.snapshot.params['_id']}`

      if(this.connected) this.socket.disconnect()

      this.fetchRequest(
        path,{headers}
      )
    })

    
    this.socket.on('history/updated',(_id:string) => {
      this.history.onUpdated(_id)
    })
    

    this.socket.on('updated',(_id:string) => {
      var result = this.fetchState().result

      var modifiedResult = result.map(m => {
        if(m.sender.usersRef === this.user._id){
          return {
            ...m,
            read:true
          }
        }
        else{
          return m
        }
      })

      setTimeout(() => {
        this.fetchState.update(current => {
          return {
            ...current,
            result:modifiedResult
          }
        })
      })

      this.history.onUpdated(_id)
    })
    
    this.socket.on('incomingMessage',m => {
      var authorization = this.authorization
      
      this.updateRequest(
        {
          groupId:this.routeState.groupId,
          _id:this.route.snapshot.params['_id']
        },
        {
          headers:new HttpHeaders({
            authorization
          })
        }
      )
      
      var result = this.fetchState().result
      
      result[result.length] = {
        ...m,
        sent:true,
        read:true
      }
      
      setTimeout(() => {
        this.fetchState.update(current => {
          return {
            ...current,
            result
          }
        })
        setTimeout(() => this.toAnchor("anchor"),2000)
      })
    })
    
    this.socket.on('history/message',m => {
      this.history.onMessage(m)
    })

    this.socket.on('history/newMessage',m => {
      this.history.onNewMessage(m)
    })

    this.socket.on('disconnect',() => {
      this.connected = false
    })

    this.socket.on('connect',() => {      
      this.connected = true

      this.socket.emit(
        'join',
        `history/${this.user._id}`
      )
      
      this.socket.emit(
        'join',
        `chat/${this.user._id}/${this.route.snapshot.params['_id']}`
      )
      
      this.socket.emit(
        'join',
         `${this.routeState.groupId}/${this.user._id}`
      )
    })
  }

  ngOnDestroy(){
    this.routeUrlSubscription.unsubscribe()
    this.socket.disconnect()
  }


//   isValid         = /^\s*$/
//   preview         = false
//   uploading       = false
//   connected       = false
//   initialized     = true
//   env             = import.meta.env
//   router          = inject(Router)
//   scroller        = inject(ViewportScroller)
//   commonService   = inject(CommonService)
//   storeService    = inject(StoreService)
//   route           = inject(ActivatedRoute)
//   requestService  = inject(RequestService)
//   firebaseService = inject(FirebaseService)
//   user            = this.storeService.user()
//   routeState      = window.history.state
//   authorization   = this.storeService.authorization()
//   storage         = this.firebaseService.storage
//   _id             = this.route.snapshot.params['_id']
//   url             = toSignal(this.route.url)

  
//   socket = io(import.meta.env.NG_APP_SERVER)

//   groupId = signal(window.history.state.groupId)
//   snapshotParamsId = signal(this.route.snapshot.params['_id'])

  
//   @ViewChild('appHistory') appHistory!:HistoryComponent

//   findProfileState = this.requestService.createInitialState<Common.Profile>()
//   fetchState = this.requestService.createInitialState<Message.All>()
//   sendState = this.requestService.createInitialState<Message.One>()
//   updateState = this.requestService.createInitialState<Message.One>()

//   findProfile = this.requestService.get<Common.Profile>({
//     cb:r => {
//       this.routeState.profile = r
//     },
//     failedCb:r => console.log(r),
//     state:this.findProfileState
//   })

//   updateRequest = this.requestService.put<Message.Update,Message.One>({
//     cb:r => console.log(r),
//     failedCb:r => console.log(r),
//     state:this.updateState,
//     path:'message'
//   })

//   sendRequest = this.requestService.post<Message.New,Message.One>({
//     failedCb:err => console.log(err),
//     cb:r => this.onSuccessSend(r._id),
//     state:this.sendState,
//     path:'message'
//   })

//   fetchRequest = this.requestService.get<Message.All>({
//     state:this.fetchState,
//     cb:messages => {
//       var headers = new HttpHeaders({authorization:this.authorization})
//       if(this.snapshotParamsId() !== this.routeState.profile.usersRef){
//         this.findProfile(
//           `profile/${this.snapshotParamsId()}`
//           ,{headers}
//         )
//       }

//       this.groupId.set(
//         messages[0].groupId
//       )
      
//       this.updateRequest({
//         groupId:this.groupId(),
//         _id:this.snapshotParamsId()
//       })

//       var result = messages.map(
//         message => ({
//           ...message,
//           sent:true
//         })
//       )

//       var sortedResult = result.sort((a,b) => {
//         return a.sendAt > b.sendAt ? 1 : -1
//       })

//       setTimeout(() => {
//         this.fetchState.update(
//           current => ({
//             ...current,
//             result
//           })
//         )
//       })
      
//       setTimeout(() => this.toAnchor("anchor2"))

//     },
//     failedCb:err => {
//       console.log(
//         err
//       )
//     },
//   })

//   txtMessage = new FormGroup({
//     value: new FormControl<string>(''),
//     description: new FormControl<string>('none'),
//     sender: new FormControl<string>(this.user._id),
//     contentType: new FormControl<string>('text'),
//   })

//   imgMessage = new FormGroup({
//     description:new FormControl<string>('...'),
//     sender:new FormControl<string>(this.user._id),
//     value:new FormControl<string>(''),
//     contentType:new FormControl<string>('image')
//   })

//   sendTextMessage(form:FormGroup,authorization:string){
//     var now = Date.now()
//     var groupId = this.groupId()
//     var accept = this.snapshotParamsId()
//     var _id = new Types.ObjectId().toString()
//     var headers = new HttpHeaders({authorization})

//     var newMessage = {
//       ...form.value,
//       sendAt:now,
//       sent:false,
//       read:false,
//       accept,
//       groupId,
//       _id,
//     }

//     var sendObject = {
//       ...form.value,
//       sendAt:now,
//       groupId,
//       accept,
//       _id
//     }


//     this.fetchState.update(current => {
//       var result = [
//         ...current.result,
//         newMessage
//       ]

//       return {
//         ...current,
//         result
//       }
//     })

//     setTimeout(() => this.toAnchor("anchor"))

//     this.appHistory.onSendMessage(newMessage,this.snapshotParamsId())


//     this.sendRequest(
//       sendObject,
//       {headers}
//     )
//   }

//   sendImage(form:FormGroup,authorization:string){
//     var now = Date.now()
//     var groupId = this.groupId()
//     var accept = this.snapshotParamsId()
//     var _id = new Types.ObjectId().toString()
//     var headers = new HttpHeaders({authorization})

//     var newMessage:Message.One = {
//       ...form.value,
//       sendAt:now,
//       sent:false,
//       read:false,
//       accept,
//       groupId,
//       _id
//     }

//     var sendObject:Message.New = {
//       ...form.value,
//       sendAt:now,
//       accept,
//       groupId,
//       _id,
//     }

//     this.fetchState.update(current => {
//       var result = [
//         ...current.result,
//         newMessage
//       ]

//       return {
//         ...current,
//         result
//       }
//     })

//     this.appHistory.onSendMessage(newMessage,this.snapshotParamsId())

//     setTimeout(() => this.toAnchor("anchor"))

//     this.sendRequest(
//       sendObject,
//       {headers}
//     )

//     this.preview = false
//   }

//   onSuccessSend(_id:string){
//     var result = this.fetchState().result
//     var JSONResult = result.map(m => {
//       return JSON.stringify(m)
//     })

//     var [filter] = result.filter(f => {
//       return f._id === _id
//     })

//     var index = JSONResult.indexOf(
//       JSON.stringify(filter)
//     )

//     result[index] = {
//       ...filter,
//       sent:true,
//       failed:false
//     }

//     this.appHistory.onSuccessSend(_id)
//     setTimeout(() => this.toAnchor("anchor"))

//     this.fetchState.update(
//       current => ({
//         ...current,
//         result
//       })
//     )
//   }

//   onIncomingMessage = this.socket.on('incomingMessage',m => {
//     this.updateRequest({
//       groupId:this.groupId(),
//       _id:this.snapshotParamsId()
//     })
    
//     var result = this.fetchState().result
    
//     var newMessage = {
//       ...m,
//       sent:true,
//       read:true
//     }

//     var sortedResult = [...result,newMessage].sort(
//       (a,b) => a.sendAt > b.sendAt ? 1 : -1
//     )

//     this.fetchState.update(current => {
//       return {
//         ...current,
//         result:[...sortedResult]
//       }
//     })
    
//     setTimeout(() => this.toAnchor("anchor"),2000)
//   })


//   onUpdated = this.socket.on('updated',(groupId:string) => {
//     var result = this.fetchState().result

//     var newResult = result.map((m) => {
//       return {
//         ...m,
//         read:true
//       }
//     })

//     setTimeout(() => this.appHistory.onUpdated(groupId))

//     setTimeout(() => {
//       this.fetchState.update((current) => {
//         return {
//           ...current,
//           result:newResult
//         }
//       })
//     })
    
//   })

//   onDisconnected = this.socket.on('disconnect',() => {
//     this.connected = false
//   })

//   onConnected = this.socket.on('connect',() => {
//     this.connected = true

//     this.socket.emit(
//       'join',
//       `history/${this.user._id}`
//     )

//     this.socket.emit(
//       'join',
//       `chat/${this.user._id}/${this.snapshotParamsId()}`
//     )

//     this.socket.emit(
//       'join',
//       `${this.groupId()}/${this.user._id}`
//     )
//   })

  // async onFileChange(event:any){
  //   try{
  //     this.uploading = true
  //     var file = event.target.files[0]
  //     var uploadRef = `send/${Date.now()}`
  //     var refs = ref(this.storage,uploadRef)
  //     var result = await uploadBytes(refs,file)
  //     var url = await getDownloadURL(result.ref)

  //     this.imgMessage.patchValue({
  //       ...this.imgMessage.value,
  //       value:url
  //     })

  //     this.preview = true
  //   }
  //   catch(err:any){
  //     console.log(err.message)
  //   }
  //   finally{
  //     this.uploading = false
  //   }
  // }

//   toAnchor(anchor:string){
//     this.scroller.scrollToAnchor(
//       anchor
//     )
//   }

//   onUrlChange = effect(() => {
//     /*
//     var currentUrl = this.url()
//     var headers = new HttpHeaders({authorization:this.authorization})
//     this.snapshotParamsId.set(this.route.snapshot.params['_id'])
    
//     if(this.connected) {
//       this.socket.disconnect()
//     }

//     if(this.groupId() !== ''){
//       this.groupId.set('')
//     }

//     this.fetchRequest(
//       `message/all/${this.snapshotParamsId()}`,
//       {headers}
//     )
//     */
//   },
//   {
//     allowSignalWrites:true
//   }
// )

//   ngOnInit(){
//     this.initialized = true
    
//     this.route.url.subscribe((url) => {
//       var headers = new HttpHeaders({authorization:this.authorization})
      
//       this.snapshotParamsId.set(this.route.snapshot.params['_id'])

//       if(this.connected) {
//         this.socket.disconnect()
//       }

//       if(this.groupId() !== ''){
//         this.groupId.set('')
//       }

//       this.fetchRequest(
//         `message/all/${this.snapshotParamsId()}`,
//         {headers}
//       )
//     })
    

//   }

//   ngOnDestroy(){
//     this.socket.disconnect()
//   }

}

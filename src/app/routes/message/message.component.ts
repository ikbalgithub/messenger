import { Store } from '@ngrx/store'
import { Types } from 'mongoose';
import { io } from 'socket.io-client'
import { Component,OnInit,inject,signal,effect } from '@angular/core';
import { Profile } from '../../../index.d'
import { ActivatedRoute,Router,Params } from '@angular/router'
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { Message,State,Authorization } from '../../../index.d'
import { RequestService } from '../../services/request/request.service'
import { CommonService } from '../../services/common/common.service'
import { HttpHeaders } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
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
export class MessageComponent implements OnInit {

  socket = io(
    '192.168.43.225:3000'
  )
  
  /**
   * Inject components dependency
   */
  route    = inject(ActivatedRoute)
  location = inject(Location)
  request  = inject(RequestService)
  store    = inject(Store<State>)
  common   = inject(CommonService)

  /**
   * component state (route params,store route state & signal)
   */
  user = toSignal(this.store.select('user'))()
  pageState:PageState = window.history.state
  _id = this.route.snapshot.params['_id']
  messages = signal<Message.All>([])

  /**
   * authorization string
   */
  
  authorization:Authorization = toSignal(this.store.select('authorization'))()
  
  /**
   * new message form
   */

  newMessage:FormGroup = new FormGroup({
    value:new FormControl<string>(''),
    groupId:new FormControl<string>(
      this.pageState.groupId
    ),
    accept:new FormControl<string>(
      this._id
    )
  })

  /**
   * request state and function
   */

  fetchAllMessageState = this.request.createInitialState<Message.All>()
  sendMessageState = this.request.createInitialState<Message.New>()

  sendNewMessage = this.request.post<Message.New,any>({
    cb:r => this.onSuccessSend(r._id),
    failedCb:r => console.log(r),
    state:this.sendMessageState,
    path:'message'
  })

  fetchAllMessageFn = this.request.get<Message.All>({
    cb:r => this.onSuccessFetch(r),
    state:this.fetchAllMessageState,
    failedCb: e => console.log(e),
  })

  /**
   * implements on init
   */

  ngOnInit(){
    this.authorization = this.common.createHeaders(
      this.authorization
    )

    this.fetchAllMessageFn(`message/all/${this._id}`,{
      headers:this.authorization
    })
  }
  
  /**
   * class method
   */

  isValid(message:string):boolean{
    var regex = /^\s*$/;
    return regex.test(
      message
    ) 
  }

  send(){
    var now = Date.now()
    var _id = (new Types.ObjectId()).toString()
   
    this.messages.update(current => {
      return  [
        ...current,{
          ...this.newMessage.value,
          _id:_id,
          sender:this.user._id,
          contentType:'',
          description:'',
          sendAt:now,
          sent:false
        }
      ]
    })
    
    this.sendNewMessage(
      {
        ...this.newMessage.value,
        _id:_id,
        sendAt:now
      },
      {
        headers:this.authorization
      }
    )
  }

  onSuccessSend(_id:string){
    var _messages = this.messages()
    var [filter] = this.messages().filter(
      f => f._id === _id
    )

    var index = _messages.indexOf(filter)
    _messages[index] = {
      ...filter,
      sent:true
    }

    this.messages.set(_messages)
  }

  onSuccessFetch(messages:Message.All){
    var _messages = messages.map(x => {
       return {
        ...x,
        sent:true
       }
    })

    this.messages.set(
       _messages
    )
  }
}

interface PageState{
  profile:Profile,
  groupId:string
}
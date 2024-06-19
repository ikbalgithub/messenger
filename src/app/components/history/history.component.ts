import { RouterLink,ActivatedRoute } from '@angular/router'
import { CommonModule } from '@angular/common';
import { Component,OnInit,inject,Input } from '@angular/core';
import { RequestService } from '../../services/request/request.service'
import { StoreService } from '../../services/store/store.service'
import { Common, Message,Ngrx, } from '../../../index.d'
import { HttpHeaders } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProfilePipe } from '../../pipes/profile/profile.pipe'
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { add, failedSend, replace, resend, resetCounter, successSend, updated } from '../../ngrx/actions/history.actions';

@Component({
  selector: 'app-history',
  standalone: true,
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
  imports: [
    ProfilePipe,
    ProgressSpinnerModule,
    CommonModule,
    AvatarModule,
    BadgeModule,
    RouterLink
  ],

})
export class HistoryComponent implements OnInit {
  
  @Input() counterId!:string
  @Input() disabled!:boolean

  storeService   = inject(StoreService)
  requestService = inject(RequestService)
  route          = inject(ActivatedRoute)
  user           = this.storeService.user() as Common.User
  authorization  = this.storeService.authorization()
  history        = this.storeService.history
  
	fetchState     = this.requestService.createInitialState<Message.Last[]>()  

  fetchRequest = this.requestService.get<Message.Last[]>({
    cb:r => {
      if(this.history().length < 1){    
        this.storeService.store.dispatch(
          add(
            {
              v:r.map(m => {
                return {
                  ...m,
                  sent:true
                }
              })
            }
          )
        )
      }
    },
    failedCb:err => {
      console.log(
        err
      )
    },
    state:this.fetchState
  })

  onNewMessage(newMessage:Message.One & {sender:string,accept:string}){
    var [filter] = this.history().filter(m => {
      return m.sender.usersRef ===
      newMessage.sender || m.accept.usersRef
      === newMessage.sender
    })
    
    if(filter){
      var index = this.history().findIndex(m => {
        return m.sender.usersRef ===
        newMessage.sender || m.accept.usersRef
        === newMessage.sender
      })
      if(filter.sender.usersRef === newMessage.sender){
        
        var value = {
          ...newMessage,
          sender:filter.sender,
          accept:filter.accept,
          unreadCounter:filter.unreadCounter+1
        }
        
        this.storeService.store.dispatch(
          replace(
            {
              index,
              value
            }
          )
        )
      }

      if(filter.sender.usersRef !== newMessage.sender){
        value = {
          ...newMessage,
          sender:filter.accept,
          accept:filter.sender,
          unreadCounter:1
        }

        this.storeService.store.dispatch(
          replace(
            {
              index,
              value
            }
          )
        )
      }
    }
  }

  onMessage(newMessage:Message.Populated){

    var [filter] = this.history().filter(m => {
      return m.sender.usersRef ===
      newMessage.sender.usersRef || m.accept.usersRef
      === newMessage.sender.usersRef
    })

    if(!filter){
      var value = {
        ...newMessage,
        unreadCounter:1
      }

      this.storeService.store.dispatch(
        add({v:[value]})
      )
    }
  }

  resetCounter(_id:string){
    var [filter] = this.history().filter(m => {
      return m.sender.usersRef === _id
    })

    
    var index = this.history().findIndex(m => {
      return m.sender.usersRef === _id
    })

    if(filter){
      this.storeService.store.dispatch(
        resetCounter({index})
      )
    }
  }

  onSendMessage(newMessage:Message.One,paramsId:string,profile:Common.Profile){
    var sender = {...this.user.profile,usersRef:this.user._id}
    
    var [filter] = this.history().filter((message,index) => {
      return (
        message.sender.usersRef
        === paramsId
      ) || (
        message.accept.usersRef
        === paramsId
      )
    })

    var index = this.history().findIndex(message => {
      return (
        message.sender.usersRef
        === paramsId
      ) || (
        message.accept.usersRef
        === paramsId
      )
    })

    if(filter){
      if(filter.sender.usersRef === this.user._id){
        var value = {
          ...newMessage,
          sender:filter.sender,
          accept:filter.accept,
          unreadCounter:0
        }

        this.storeService.store.dispatch(
          replace(
            {
              index,
              value
            }
          )
        )
      }

      if(filter.sender.usersRef !== this.user._id){
        value = {
          ...newMessage,
          sender:filter.accept,
          accept:filter.accept,
          unreadCounter:0
        }

        this.storeService.store.dispatch(
          replace(
            {
              index,
              value
            }
          )
        )
      }
    }
		else{
      value = {
        ...newMessage,
        sender:sender,
        accept:profile,
        unreadCounter:0
      }
			this.storeService.store.dispatch(
        add({v:[value]})
      )
		}
  }

  onSuccessSend(_id:string){
    var index = this.history().findIndex( message => {
      return message._id === _id
    })

    this.storeService.store.dispatch(
      successSend(
        {
          index
        }
      )
    )
  }

  onUpdated(_id:string){
    var index = this.history().findIndex(m => {
      return  m.sender.usersRef === _id 
      || m.accept.usersRef === _id
    })

    this.storeService.store.dispatch(
      updated({index})
    )
  }

  showUnreadCounter(message:Message.Last):boolean{
    return (
      message.sender.usersRef !== this.user._id 
        ? message.sender.usersRef !== this.counterId 
            ? message.unreadCounter > 0 
              ? true 
              : false
            : false 
        : false
    )
  }

  onFailedSend(_id:string){
    var index = this.history().findIndex(m => {
      return m._id === _id
    })

    this.storeService.store.dispatch(
      failedSend({index})
    )
  }

  onResend(_id:string){

    var [filter] = this.history().filter(m => {
      return m._id === _id
    })

    var index = this.history().findIndex(m => {
      return m._id === _id
    })

    if(filter){
      this.storeService.store.dispatch(
        resend({index})
      )
    }
  }

  ngOnInit(){
    var authorization = this.authorization
    var headers = new HttpHeaders({authorization})

    this.fetchRequest(
      'message/recently',
      {headers}
    )
  }

  test(){
    alert('test')
  }
}

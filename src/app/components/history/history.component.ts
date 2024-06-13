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
  @Input() consumerTag!:string

  storeService   = inject(StoreService)
  user           = this.storeService.user()
  requestService = inject(RequestService)
  route          = inject(ActivatedRoute)
  authorization  = this.storeService.authorization()
  
	fetchState     = this.requestService.createInitialState<Message.Last[]>()  

  fetchRequest = this.requestService.get<Message.Last[]>({
    cb:result => {
      var newResult = result.map((r) => {
        return {
          ...r,
          sent:true
        }
      })

      setTimeout(() => {
        this.fetchState.update(current => {
          return {
            ...current,
            result:newResult
          }
        })
      })
    },
    failedCb:err => console.log(err),
    state:this.fetchState
  })

  onNewMessage(newMessage:Message.One & {sender:string,accept:string}){
    var result = this.fetchState().result
    var JSONMessages = result.map(m => JSON.stringify(m))
    var [filter] = result.filter(m => {
      return m.sender.usersRef ===
      newMessage.sender || m.accept.usersRef
      === newMessage.sender
    })
    
    if(filter){
      var index = JSONMessages.indexOf(
        JSON.stringify(filter)
      )
      if(filter.sender.usersRef === newMessage.sender){
        result[index] = {
          ...newMessage,
          sender:filter.sender,
          accept:filter.accept,
          unreadCounter:filter.unreadCounter+1
        }
      }

      if(filter.sender.usersRef !== newMessage.sender){
        result[index] = {
          ...newMessage,
          sender:filter.accept,
          accept:filter.sender,
          unreadCounter:1
        }
      }

      setTimeout(() => {
        this.fetchState.update(current => {
          return {
            ...current,
            result
          }
        })
      })
    }
    
  }

  onMessage(newMessage:Message.Populated){
    var result = this.fetchState().result

    var [filter] = result.filter(m => {
      return m.sender.usersRef ===
      newMessage.sender.usersRef || m.accept.usersRef
      === newMessage.sender.usersRef
    })

    if(!filter){
      result[result.length] = {
        ...newMessage,
        unreadCounter:1
      }
    }

    setTimeout(() => {
      this.fetchState.update(current => {
        return {
          ...current,
          result
        }
      })
    })
  }

  onAfterFetch(_id:string){
    var result = this.fetchState().result
    var JSONMessages = result.map(m => JSON.stringify(m))
    
    var [filter] = result.filter(m => m.sender.usersRef === _id)
    
    var index = JSONMessages.indexOf(JSON.stringify(filter))

    result[index] = {
      ...filter,
      unreadCounter:0
    }

    setTimeout(() => {
      this.fetchState.update(current => {
        return {
          ...current,
          result
        }
      })
    })
  }

  onSendMessage(newMessage:Message.One,paramsId:string,profile:Common.Profile){
    var result = this.fetchState().result
    var JSONMessages = result.map(m => JSON.stringify(m))
    var sender = {...this.user?.profile,usersRef:this.user?._id}

    var [filter] = result.filter((message,index) => {
      return (
        message.sender.usersRef
        === paramsId
      ) || (
        message.accept.usersRef
        === paramsId
      )
    })

    var index = JSONMessages.indexOf(JSON.stringify(filter))

    if(filter){
      if(filter.sender.usersRef === this.user?._id){
        result[index] = {
          ...newMessage,
          sender:filter.sender,
          accept:filter.accept,
          unreadCounter:0
        }
      }

      if(filter.sender.usersRef !== this.user?._id){
        result[index] = {
          ...newMessage,
          sender:filter.accept,
          accept:filter.sender,
          unreadCounter:0
        }
      }
    }
		else{
			result[result.length] = {
				...newMessage,
				sender:sender as Common.Profile,
        accept:profile,
				unreadCounter:0
			}
		}

    setTimeout(() => {
      this.fetchState.update(current => {
        return {
          ...current,
          result
        }
      })
    })
  }

  onSuccessSend(_id:string){
    var result = this.fetchState().result
    var JSONMessages = result.map(m => JSON.stringify(m))
    var [filter] = result.filter((message,index) => {
      return message._id === _id
    })
    var index = JSONMessages.indexOf(
      JSON.stringify(filter)
    )
    result[index] = {
      ...filter,
      sent:true,
      failed:false
    }
    setTimeout(() => {
      this.fetchState.update(current => {
        return {
          ...current,
          result
        }
      })
    })
  }

  onUpdated(_id:string){
    var result = this.fetchState().result
    var JSONMessages = result.map(m => JSON.stringify(m))
    var [filter] = result.filter(m => m.sender.usersRef === _id || m.accept.usersRef === _id)

    var index = JSONMessages.indexOf(JSON.stringify(filter))

    result[index] = {...filter,read:true}

    setTimeout(() => {
      this.fetchState.update((current) => {
        return {
          ...current,
          result
        }
      })
    })
  }

  showUnreadCounter(message:Message.Last):boolean{
    return (
      message.sender.usersRef !== this.user?._id 
        ? message.sender.usersRef !== this.counterId 
            ? message.unreadCounter > 0 
              ? true 
              : false
            : false 
        : false
    )
  }

  onFailedSend(_id:string){
    var result = this.fetchState().result
    var JSONResult = result.map(m => {
      return JSON.stringify(m)
    })

    var [filter] = result.filter(m => {
      return m._id === _id
    })

    var index = JSONResult.indexOf(
      JSON.stringify(filter)
    )

    result[index] = {
      ...filter,
      sent:false,
      failed:true
    }

    setTimeout(() => {
      this.fetchState.update(current => {
        return {
          ...current,
          result
        }
      })
    })
  }

  onResend(_id:string){
    var result = this.fetchState().result
    var JSONResult = result.map(m => {
      return JSON.stringify(m)
    })

    var [filter] = result.filter(m => {
      return m._id === _id
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
    })
  }

  ngOnInit(){
    var authorization = this.authorization as string
    var headers = new HttpHeaders({authorization})

    this.fetchRequest(
      'message/recently',
      {headers}
    )
  }
}

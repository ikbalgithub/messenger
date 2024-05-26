import { RouterLink,ActivatedRoute } from '@angular/router'
import { CommonModule } from '@angular/common';
import { Component,OnInit,inject,Input } from '@angular/core';
import { RequestService } from '../../services/request/request.service'
import { StoreService } from '../../services/store/store.service'
import { Message,Ngrx, } from '../../../index.d'
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
export class HistoryComponent implements Events, OnInit {
  @Input() counterId!:string
  @Input() disabled!:boolean
 
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

  onNewMessage(newMessage:Message.One){
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
  }

  onMessage(newMessage:Message.Populated){
    var messages = this.fetchState().result as Message.Last[]
    if(messages.filter(e => e._id === newMessage._id)?.length < 1){
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
    }
  }

  onSendMessage(newMessage:Message.One){
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
        var index = JSONMessages.indexOf(
          JSON.stringify(filter)
        )

        result[index] = {
          ...newMessage,
          sender:filter.sender,
          accept:filter.accept,
          unreadCounter:0,
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
          unreadCounter:0
        }

        this.fetchState.update(current => {
          return {
            ...current,
            result
          }
        })
      }
    }
  }

  showUnreadCounter(message:Message.Last):boolean{
    var {sender,unreadCounter} = message

    return (
      sender.usersRef !== this.user._id 
        ? sender.usersRef !== this.counterId 
            ? (unreadCounter as number) > 0 
                ? true 
                : false
            : false 
        : false
    )
  }

  ngOnInit(){
    var authorization = this.authorization
    var headers = new HttpHeaders({authorization})

    this.route.url.subscribe((url) => {
      this.fetchRequest(
        'message/recently',
        {headers}
      )
    })
  }

  onSuccessSend(_id:string){
    var result = this.fetchState().result as Message.Last[]
    var JSONMessages = result.map(m => JSON.stringify(m))

    var [filter] = result.filter(m => m._id === _id)

    var index = JSONMessages.indexOf(
      JSON.stringify(filter)
    )

    result[index] = {
      ...filter,
      sent:true
    }

    this.fetchState.update(current => {
      return {
        ...current,
        result
      }
    })

    //console.log({_id})
    //console.log(result)

    // result[index] = {
    //   ...filter,
    //   sent:true
    // }


    // setTimeout(() => {
    //   this.fetchState.update(current => {
    //     return {
    //       ...current,
    //       result
    //     }
    //   })
    // })
    
  }

}


interface Events{
  onNewMessage:(message:Message.One) => void,
  onMessage:(message:Message.Populated) => void,
  onSendMessage:(message:Message.One) => void,
  onSuccessSend:(_id:string) => void
}
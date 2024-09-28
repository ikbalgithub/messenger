import { RouterLink,ActivatedRoute } from '@angular/router'
import { CommonModule,JsonPipe } from '@angular/common';
import { Component,OnInit,inject,Input } from '@angular/core';
import { StoreService } from '../../services/store/store.service'
import { Common, Message,Model, } from '../../../index.d'
import { HttpHeaders } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { add, failedSend, replace, resend, resetCounter, successSend, updated } from '../../ngrx/actions/history.actions';
import { GraphqlModule } from '../../graphql/graphql.module';
import { GraphqlService } from '../../graphql/graphql.service';
import { FETCH_HISTORY } from '../../graphql/graphql.queries';
import { ApolloError } from 'apollo-client';
import { DocumentNode } from 'graphql';
import { SentByOwnPipe } from '../../pipes/sentByOwn/sent-by-own.pipe';

@Component({
  selector: 'app-history',
  standalone: true,
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
  imports: [
    GraphqlModule,
    SentByOwnPipe,
    ProgressSpinnerModule,
    CommonModule,
    AvatarModule,
    BadgeModule,
    RouterLink,
    JsonPipe
  ],

})
export class HistoryComponent implements OnInit {
  @Input() connected!:boolean
  @Input() counterId!:string
  @Input() disabled!:boolean

  process = false
  isError = false
  errorMessage = ''
  graphqlService = inject(GraphqlService)
  storeService   = inject(StoreService)
  route          = inject(ActivatedRoute)
  user           = this.storeService.user()
  authorization  = this.storeService.authorization()
  history        = this.storeService.history

  onNewMessage(newMessage:Message.One & {sender:string,accept:string}){
   
   
  }

  onMessage(newMessage:Message.Populated){
   
  }

 
  onSendMessage(newMessage:Message.One,paramsId:string,profile:Common.Profile){
    
  }

  onSuccessSend(_id:string){
   
  }

  onUpdated(_id:string){
    
  }

  

  onFailedSend(_id:string){
    
  }

  onResend(_id:string){

  }

  handleFetchResponse(data:History,error:string|undefined){
    if(error){
      this.complete(
        true,error
      )
    }
    else{
      var result = data.map(m => {
        var filter = m.sender._id === this.user._id
        var modified = {status:{sent:true},detail:m}

        return filter ? modified : {
          status:{},
          detail:m
        }
      })

      if(this.history().length < 1){
        this.storeService.store.dispatch(
          add({v:result})
        )
      }

      this.complete(
        false,''
      )
    }
  }

  reset(){
    this.isError = false
    this.process = true
    this.errorMessage = ''
  }

  complete(isError:boolean,errorMessage:string){
    if(isError){
      this.process = false
      this.isError = true
      this.errorMessage = errorMessage
    }
    else{
      this.process = false
    }
  }

  runFetch(query:DocumentNode,headers:HttpHeaders){
    this.graphqlService.query<{_:History},{}>(
      {
        query,
        context:{headers}
      }
    )
    .subscribe(
      r => this.handleFetchResponse(
        r.data._,
        r.error?.message ?? undefined
      )
    )
  }

  preFetch(){
    this.reset()
    var query = FETCH_HISTORY
    var headers = new HttpHeaders({
      'authorization':this.authorization,
      'bypass-tunnel-reminder':'true',
      'credentials':'include'
    })
    this.runFetch(
      query,
      headers
    )
  }
  
  ngOnInit(){
    this.preFetch()
  }

  test(){
    alert('test')
  }
}

type History = Model.Message<Sender,Accept>[]
type Status  = {sent?:boolean,failed?:boolean}
type Sender = {_id:string,profile:Omit<Model.Profile,"usersRef"|"_id">}
type Accept = {_id:string,profile:Omit<Model.Profile,"usersRef"|"_id">}
export type Modified  = {status:Status,detail:History[number]}

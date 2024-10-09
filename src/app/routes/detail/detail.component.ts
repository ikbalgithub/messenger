import { io } from 'socket.io-client'
import { Subscription, } from 'rxjs'
import { ImageModule } from 'primeng/image';
import { CommonModule,ViewportScroller,Location } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { AvatarModule } from 'primeng/avatar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Component,ViewChild,inject,OnInit,OnDestroy,HostListener, signal, computed } from '@angular/core';
import { HistoryComponent } from '../../components/history/history.component'
import { CommonService } from '../../services/common/common.service'
import { StoreService } from '../../services/store/store.service'
import { FirebaseService } from '../../services/firebase/firebase.service'
import { RequestService } from '../../services/request/request.service'
import { Message,Common,Model } from '../../../index.d'
import { ActivatedRoute,Router,Params } from '@angular/router'
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FormControl,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { ref,uploadBytes,getDownloadURL } from 'firebase/storage'
import { add, failedSend, init, resend, successSend, updated } from '../../ngrx/actions/messages.actions';
import { FilterPipe } from '../../pipes/filter/filter.pipe';
import { GraphqlService } from '../../graphql/graphql.service';
import { FETCH_DETAIL } from '../../graphql/graphql.queries';
import { ApolloError } from '@apollo/client';

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
  process           = false
  isError           = false
  errorMessage      = ''
	isValid           = /^\s*$/
  url:Tmp<Subscription>  = undefined
  location          = inject(Location)
  graphql           = inject(GraphqlService)
  scroller          = inject(ViewportScroller)
  route             = inject(ActivatedRoute)
  firebaseService   = inject(FirebaseService)
  requestService    = inject(RequestService)
  storeService      = inject(StoreService)
  commonService     = inject(CommonService)
  storage           = this.firebaseService.storage
  user              = this.storeService.user() as User
  authorization     = this.storeService.authorization()
  messages          = this.storeService.messages
  routeState        = window.history.state
  currentUser       = this.route.snapshot.params['_id']
  socket            = io(import.meta.env.NG_APP_SERVER,{autoConnect:false})
  updateState       = this.requestService.createInitialState<Message.One>()
  fetchState        = this.requestService.createInitialState<Message.All>()

  @ViewChild('history') history !:HistoryComponent

  updateRequest = this.requestService.put<Message.Update,Message.One>({
    cb:r => {
      
    },
    failedCb:r => console.log(r),
    state:this.updateState,
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
        
      }

      setTimeout(() => this.toAnchor("anchor2"))
      setTimeout(() => this.socket.connect(),1000)
    },
    state:this.fetchState,
  })


  toAnchor(anchor:string){
    this.scroller.scrollToAnchor(anchor)
  }

 
  handleFetchResponse(result:Model.Message<string,string>[],error:ApolloError|undefined){
    if(error){
      this.process = false
      this.isError = true
      this.errorMessage = error.message
    }
    else{
     // run update
     this.process = false
     var messages = result.map(message => {
       var received = message.sender === this.user._id
       
       return {
         ...message,
         older:true,
         received
        }
      
     })
     var filtered = this.messages().filter(m => m._id === this.currentUser)
     if(filtered.length < 1) this.storeService.store.dispatch(
       init(
        {
          _id:this.currentUser,
          messages:messages
        }
       )
     )
    }
  }

  ngOnInit(){
    this.url = this.route.url.subscribe(c => {   
      if(this.route.snapshot.params['_id'] !== this.currentUser){
        this.currentUser = this.route.snapshot.params['_id']
        
        this.routeState = window.history.state     

        var headers = new HttpHeaders({
          'authorization':this.authorization,
          'bypass-tunnel-reminder':'true',
          'credentials':'includes'
        })

        this.socket.disconnect()
        
        this.process = true
        this.graphql.query<{_:Model.Message<string,string>[]},{_id:string}>(
          {
            context:{headers},
            query:FETCH_DETAIL,
            variables:{_id:this.currentUser},
          }
        )
        .subscribe(r => {
          this.handleFetchResponse(
            r.data._,
            r.error
          )
        })
      }
      else{
        this.process = true
        var headers = new HttpHeaders({
          'authorization':this.authorization,
          'bypass-tunnel-reminder':'true',
          'credentials':'includes'
        })
        this.graphql.query<{_:Model.Message<string,string>[]},{_id:string}>(
          {
            context:{headers},
            query:FETCH_DETAIL,
            variables:{_id:this.currentUser},
          }
        )
        .subscribe(r => {
          this.handleFetchResponse(
            r.data._,
            r.error
          )
        })
      }
    })

    this.socket.on('connect',() => {

    })
  }

  ngOnDestroy(){
    this.url?.unsubscribe()
    this.socket.disconnect()
  }
}


interface WHS{
  groupId:string,
  profile:Common.Profile
}

type User = Common.User

type Tmp<T> = T | undefined

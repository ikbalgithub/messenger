import { Store } from '@ngrx/store'
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common';
import { Component,OnInit,inject,Signal,signal,effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { State,Message,Request } from '../../../index.d'
import { RequestService } from '../../services/request/request.service'
import { LastMessageComponent } from '../../components/last-message/last-message.component'
import { ProfilePipe } from '../../pipes/profile/profile.pipe'
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToStringPipe } from '../../pipes/toString/to-string.pipe'
import { AvatarModule } from 'primeng/avatar';
import { CommonService } from '../../services/common/common.service'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
  imports: [
    AvatarModule,
    CommonModule,
    LastMessageComponent,
    ProfilePipe,
    ButtonModule,
    ProgressSpinnerModule,
    ToStringPipe
  ],
})
export class HomeComponent implements OnInit{
  
  router = inject(Router)
  store = inject(Store<State>)
  requestSvc = inject(RequestService)
  commonSvc = inject(CommonService)

  recentlyMessages = signal<Message.Last[]>([])
  user = toSignal(this.store.select('user'))()

  
  authorization:string|HttpHeaders = toSignal(this.store.select('authorization'))()

  fetchRecentlyMessagesState = this.requestSvc.createInitialState<Message.Last[]>()
  
  fetchRecentlyMessagesFn = this.requestSvc.get<Message.Last[]>({
    state:this.fetchRecentlyMessagesState,
    cb:r => this.recentlyMessages.set(r),
    failedCb: e => this.onFailed()
  })

  ngOnInit(){
    this.authorization = this.commonSvc.createHeaders(
      this.authorization
    )

    this.fetchRecentlyMessagesFn('message/recently',{
      headers:this.authorization
    })
  }

  onFailed(){
    this.recentlyMessages.set(
      [
        {
          sendAt:1705252055177,
          read:true,
          contentType:'',
          description:'',
          unreadCounter:0,
          value:'halo',
          groupId:'x',
          sender:{
            surname:'Huljannah',
            firstName:'Mifta',
            profileImage:'x',
            usersRef:'x'
          },
          accept:{
            surname:'Huljannah',
            firstName:'Mifta',
            profileImage:'x',
            usersRef:'x'
          }
        }
      ]
    )
  }

  retry(){
    (this.fetchRecentlyMessagesState().retryFunction as Function)()
  }
}

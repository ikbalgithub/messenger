import { Store } from '@ngrx/store'
import { Component,OnInit,inject,signal } from '@angular/core';
import { Profile } from '../../../index.d'
import { ActivatedRoute,Router,Params } from '@angular/router'
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Location } from '@angular/common';
import { Message,State } from '../../../index.d'
import { RequestService } from '../../services/request/request.service'
import { CommonService } from '../../services/common/common.service'
import { HttpHeaders } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';



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
    InputGroupModule
  ]
})
export class MessageComponent implements OnInit {
  route = inject(ActivatedRoute)
  location = inject(Location)
  request = inject(RequestService)
  store = inject(Store<State>)
  common = inject(CommonService)
  messages = signal<Message.All>([])

  _id = this.route.snapshot.params['_id']
  user = toSignal(this.store.select('user'))()

  pageState:{profile:Profile} = window.history.state
  
  

  authorization:string|HttpHeaders = toSignal(this.store.select('authorization'))()

  fetchAllMessageState = this.request.createInitialState<Message.All>()
  fetchAllMessageFn = this.request.get<Message.All>({
    cb:r => this.messages.set(r),
    state:this.fetchAllMessageState,
    failedCb: e => this.onFailed(),
  })

  ngOnInit(){
    this.authorization = this.common.createHeaders(
      this.authorization
    )

    this.fetchAllMessageFn(`message/all/${this._id}`,{
      headers:this.authorization
    })
  }

  onFailed(){
    this.messages.set([
      {
        _id:Math.random().toString().split('.')[1],
        sender:'64758f8928c522f39af3d441',
        sendAt:0,
        value:'halo',
        groupId:'',
        accept:'x',
        read:true,
        contentType:'',
        description:'x'
      },
      {
        _id:Math.random().toString().split('.')[1],
        sender:'',
        sendAt:0,
        value:'halo juga',
        groupId:'',
        accept:'64758f8928c522f39af3d441',
        read:true,
        contentType:'',
        description:'x'
      }
    ])
  }
}

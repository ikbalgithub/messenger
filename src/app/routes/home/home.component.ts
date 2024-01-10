import { Store } from '@ngrx/store'
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router'
import { CommonModule } from '@angular/common';
import { Component,OnInit,inject,Signal,signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { State,Message,Request } from '../../../index.d'
import { RequestService } from '../../services/request/request.service'


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  
  router = inject(Router)
  store = inject(Store<State>)
  requestSvc = inject(RequestService)
  user = toSignal(this.store.select('user'))()
  recentlyMessages = signal<Message.Last[]>([])

  
  authorization:string|HttpHeaders = `Bearer ${this.user.authorization}` as string
  
  fetchRecentlyMessagesState = this.requestSvc.createInitialState<Message.Last[]>()
  
  fetchRecentlyMessagesFn = this.requestSvc.get<Message.Last[]>({
    state:this.fetchRecentlyMessagesState,
    cb:r => this.recentlyMessages.set(r),
    failedCb: e => console.log(e)
  })

  ngOnInit(){
    this.authorization = this.authorization as string
    this.authorization = new HttpHeaders({
      authorization:this.authorization
    })

    this.fetchRecentlyMessagesFn('message/recently',{
      headers:this.authorization
    })
  }

  retry(){
    (this.fetchRecentlyMessagesState().retryFunction as Function)()
  }
}

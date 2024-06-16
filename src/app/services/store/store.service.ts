import { Injectable,inject,effect, Signal } from '@angular/core';
import { Message, Ngrx } from '../../../index.d'
import { Store } from '@ngrx/store'
import { toSignal } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root'
})
export class StoreService {
  rootInit = false
  store = inject(Store<Ngrx.State>)
  user = toSignal<Ngrx.User>(this.store.select('user')) as Signal<Ngrx.User>  
  history = toSignal<Ngrx.History[]>(this.store.select('history')) as Signal<Ngrx.History[]>
  authorization = toSignal<string>(this.store.select('authorization')) as Signal<string>
  preview = toSignal<Message.Last[]>(this.store.select('preview')) as Signal<Message.Last[]>
  authentication = toSignal<Ngrx.Authentication>(this.store.select('authentication')) as Signal<Ngrx.Authentication>

  synchWithLocalStorage = effect(() => {
    if(this.rootInit){
      var jsonState = JSON.stringify({
        authentication:this.authentication(),
        authorization:this.authorization(),
        user:this.user()
      })

      localStorage.setItem(
        "ngrx",
        jsonState
      )
    }
  })

  init(){
    this.rootInit = true
  }
}

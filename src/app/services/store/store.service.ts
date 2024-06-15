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
  history = toSignal<Ngrx.History[]>(this.store.select('history'))
  user = toSignal<Ngrx.User>(this.store.select('user'))
  authorization = toSignal<string>(this.store.select('authorization'))
  preview = toSignal<Message.Last[]>(this.store.select('preview')) as Signal<Message.Last[]>
  authentication = toSignal<Ngrx.Authentication>(this.store.select('authentication'))

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

import { Injectable,inject,effect } from '@angular/core';
import { Ngrx } from '../../../index.d'
import { Store } from '@ngrx/store'
import { toSignal } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root'
})
export class StoreService {
  rootInit = false
  store = inject(Store<Ngrx.State>)
  user = toSignal(this.store.select('user'))
  authorization = toSignal(this.store.select('authorization'))
  authentication = toSignal(this.store.select('authentication'))

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

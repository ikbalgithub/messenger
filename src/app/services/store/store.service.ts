import { Injectable,inject } from '@angular/core';
import { Ngrx } from '../../../index.d'
import { Store } from '@ngrx/store'
import { toSignal } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root'
})
export class StoreService {
  store = inject(Store<Ngrx.State>)
  user = toSignal(this.store.select('user'))()
  authorization = toSignal(this.store.select('authorization'))()
  authentication = toSignal(this.store.select('authentication'))()
}

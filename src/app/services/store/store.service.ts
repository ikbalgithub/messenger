import { Injectable,inject,effect, Signal, EffectRef } from '@angular/core';
import { Message, Ngrx } from '../../../index.d'
import { Store } from '@ngrx/store'
import { toSignal } from '@angular/core/rxjs-interop';


@Injectable({
  providedIn: 'root'
})
export class StoreService {
  store = inject(Store<Ngrx.State>)
  user = toSignal(this.store.select('user')) as Signal<Ngrx.User>
  authorization = toSignal(this.store.select('authorization')) as Signal<string>
  authentication = toSignal(this.store.select('authentication')) as Signal<Ngrx.Authentication>
  messages = toSignal(this.store.select('messages')) as Signal<Ngrx.Messages[]>
  history = toSignal(this.store.select('history')) as Signal<Ngrx.History
}

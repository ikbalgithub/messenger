import { Injectable,inject,effect, Signal, EffectRef } from '@angular/core';
import { Message, Ngrx } from '../../../index.d'
import { Store } from '@ngrx/store'
import { toSignal } from '@angular/core/rxjs-interop';
import { History } from '../../components/history/history.component';
import { User } from '../../ngrx/actions/user.actions';
import { Cache } from '../../ngrx/actions/messages.actions';


@Injectable({
  providedIn: 'root'
})
export class StoreService {
  store = inject(Store<Ngrx.State>)
  user = toSignal(this.store.select('user')) as Signal<User>
  authorization = toSignal(this.store.select('authorization')) as Signal<string>
  authentication = toSignal(this.store.select('authentication')) as Signal<Ngrx.Authentication>
  messages = toSignal(this.store.select('messages')) as Signal<Cache[]>
  history = toSignal(this.store.select('history')) as Signal<History>
}

import { Store } from '@ngrx/store'
import { effect,Signal,EffectRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Component,HostListener,inject } from '@angular/core';
import { State,Profile, } from '../index.d'



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  store = inject(Store<State>)
  user = toSignal(this.store.select('user'))
  authentication = toSignal(this.store.select('authentication'))
  authorization = toSignal(this.store.select('authorization'))

  syncWithLocalStorage = effect(() => {
    var jsonState = JSON.stringify({
      authentication:this.authentication(),
      authorization:this.authorization(),
      user:this.user()
    })

    localStorage.setItem(
      "ngrx",
      jsonState
    )
  })
}

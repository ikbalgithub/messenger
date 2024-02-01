import { Store } from '@ngrx/store'
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Component,signal,computed,effect,HostListener,inject } from '@angular/core';
import { Ngrx } from '../index.d'
import { CommonModule } from '@angular/common'



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  store = inject(Store<Ngrx.State>)
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

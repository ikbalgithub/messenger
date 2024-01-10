import { Store } from '@ngrx/store'
import { effect,Signal,EffectRef } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { Component,HostListener,inject } from '@angular/core';
import { State,User,Profile,Auth } from '../index.d'



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  store:Store<any> = inject(Store<State>)
  user:Signal<any> = toSignal(this.store.select('user'))
  auth:Signal<any> = toSignal(this.store.select('auth'))

  syncWithLocalStorage:EffectRef = effect(() => {
    var currentAuthStatus:Auth = this.auth()
    var currentUser:User = this.user()

    var ngrxString:string = JSON.stringify({
      auth:currentAuthStatus,
      user:currentUser
    })

    if(currentAuthStatus.loggedIn){
      this.sync(ngrxString)
    }
  })

  sync(ngrxJsonString:string){
    localStorage.setItem(
      "ngrx",
      ngrxJsonString
    )
  }
}

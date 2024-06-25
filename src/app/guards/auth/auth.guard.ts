import { inject,Signal } from '@angular/core';
import { Ngrx } from '../../../index.d'
import { Store } from '@ngrx/store'
import { toSignal } from '@angular/core/rxjs-interop';
import { CanActivateFn,Router,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';


export const authGuard = (route:ActivatedRouteSnapshot,state:RouterStateSnapshot):boolean => {
  var canContinue = false
  var router = inject(Router)
  var store = inject(Store<Ngrx.State>)
  var authentication = toSignal(store.select('authentication'))()

  var loggedIn = authentication.loggedIn ?? false
  var onLoginPage = state.url === '/login'

  if(!loggedIn && onLoginPage) canContinue = true
  if(!loggedIn && !onLoginPage) canContinue = false
  if(loggedIn && !onLoginPage) canContinue = true
  if(loggedIn && onLoginPage) canContinue = false 
 
  if(!loggedIn && !onLoginPage){
    router.navigate(['login'])
  }
  
  if(loggedIn && onLoginPage) {
    router.navigate([''])
  }

  return canContinue
};

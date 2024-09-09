import { computed, inject,Signal } from '@angular/core';
import { Router,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';
import { StoreService } from '../../services/store/store.service';


export const authGuard = (route:ActivatedRouteSnapshot,state:RouterStateSnapshot):boolean => {
  var router = inject(Router)
  var storeService = inject(StoreService)
  var authentication = storeService.authentication
  var onLoginPage = state.url === '/login'

  var canContinue = computed<boolean>(() => {
    return authentication().loggedIn
      ? onLoginPage
        ? false
        : true
      : onLoginPage
        ? true
        : false
  })

 
  if(!authentication().loggedIn && !onLoginPage){
    router.navigate(['login'])
  }
  
  if(authentication().loggedIn && onLoginPage) {
    router.navigate([''])
  }

  return canContinue()
};

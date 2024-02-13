import { Store } from '@ngrx/store'
import { CommonService } from '../common/common.service'
import { Router } from '@angular/router'
import { Injectable,inject } from '@angular/core';
import { Ngrx,Common } from '../../../index.d'
import { login,logout } from '../../ngrx/actions/authentication.actions'
import { setUser,setNull } from '../../ngrx/actions/user.actions'
import { setAuthorization,reset } from '../../ngrx/actions/authorization.actions'

@Injectable({providedIn:'root'}) export class AuthService {
  store = inject(Store<Ngrx.State>)
  common = inject(CommonService)
  router = inject(Router)

  next(user:Common.Authenticated){
    var {authorization,...rest} = user

    this.store.dispatch(login())
    this.store.dispatch(setUser(rest))
    this.store.dispatch(setAuthorization(
      {
        authorization
      }
    ))
   
    this.router.navigate(
      ['']
    )
  }

  logout(){
    this.store.dispatch(logout())
    this.store.dispatch(reset())
    this.store.dispatch(setNull())

    this.router.navigate(
      ['login']
    )
  }

}

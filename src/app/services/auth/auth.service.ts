import { Store } from '@ngrx/store'
import { CommonService } from '../common/common.service'
import { Router } from '@angular/router'
import { Injectable,inject } from '@angular/core';
import { State,Authenticated } from '../../../index.d'
import { login } from '../../ngrx/actions/authentication.actions'
import { setUser } from '../../ngrx/actions/user.actions'
import { setAuthorization } from '../../ngrx/actions/authorization.actions'

@Injectable({providedIn:'root'}) export class AuthService {
  store = inject(Store<State>)
  common = inject(CommonService)
  router = inject(Router)

  next(user:Authenticated){
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

}

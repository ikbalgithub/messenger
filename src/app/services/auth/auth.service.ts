import { Store } from '@ngrx/store'
import { CommonService } from '../common/common.service'
import { Router } from '@angular/router'
import { Injectable,inject } from '@angular/core';
import { Ngrx,Common, Model } from '../../../index.d'
import { setAuthorization,reset } from '../../ngrx/actions/authorization.actions'
import { setLogin,setLogout } from '../../ngrx/actions/authentication.actions'
import { login,logout } from '../../ngrx/actions/user.actions'
import { resetHistory } from '../../ngrx/actions/history.actions';
import { resetMessages } from '../../ngrx/actions/messages.actions';

@Injectable({providedIn:'root'}) export class AuthService {
  store = inject(Store<Ngrx.State>)
  common = inject(CommonService)
  router = inject(Router)

  next(payload:Payload){
    var {authorization,...rest} = payload

    this.store.dispatch(setLogin())
    this.store.dispatch(login(rest))
    this.store.dispatch(setAuthorization({authorization}))
    this.router.navigate(
      ['']
    )
  }

  logout(){
    localStorage.removeItem("ngrx")
    this.store.dispatch(reset())
    this.store.dispatch(logout())
    this.store.dispatch(setLogout())
    this.store.dispatch(resetHistory())
    this.store.dispatch(resetMessages())
    localStorage.removeItem("ngrx")
    this.router.navigate(['login'])
  }
}

export interface Payload {
  _id:string,
  profile:Model.Profile,
  authorization:string
}

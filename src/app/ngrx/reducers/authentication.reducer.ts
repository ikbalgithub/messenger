import { createReducer,on } from '@ngrx/store';
import { Ngrx } from '../../../index.d'
import { login,logout } from '../actions/authentication.actions';

var state = JSON.parse(localStorage.getItem("ngrx") as string)

export const authenticationReducer = createReducer<Ngrx.Authentication>(
  state?.authentication ?? {loggedIn:false},

  on(login,(state:Ngrx.Authentication) => ({
    loggedIn:true
  })),

  on(logout,(state:Ngrx.Authentication) => ({
    loggedIn:false
  }))
  
);

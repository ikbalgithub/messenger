import { createReducer,on } from '@ngrx/store';
import { Authentication } from '../../../index.d'
import { login,logout } from '../actions/authentication.actions';

var state = JSON.parse(localStorage.getItem("ngrx") as string)

export const authenticationReducer = createReducer<Authentication>(
  state?.authentication ?? {loggedIn:false},

  on(login,(state:Authentication) => ({
    loggedIn:true
  })),

  on(logout,(state:Authentication) => ({
    loggedIn:false
  }))
  
);

import { createReducer,on } from '@ngrx/store';
import { Auth,State } from '../../../index.d'
import { login,logout } from '../actions/auth.actions';

var state = JSON.parse(localStorage.getItem("ngrx") as string)


export const authReducer = createReducer<Auth>(
  state?.auth ?? {loggedIn:false},

  on(login,(state:Auth) => ({
    loggedIn:true
  })),

  on(logout,(state:Auth) => ({
    loggedIn:false
  }))
  
);

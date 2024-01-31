import { createReducer,on } from '@ngrx/store';
import { Ngrx } from '../../../index.d'
import { setUser } from '../actions/user.actions';

var state = JSON.parse(localStorage.getItem("ngrx") as string)


export const userReducer = createReducer<Ngrx.User>(
  state?.user ?? {
    _id:null,
    profile:null,
  },

  on(setUser,(state:Ngrx.User,payload:Ngrx.User) => {
    return payload
  })
  

);

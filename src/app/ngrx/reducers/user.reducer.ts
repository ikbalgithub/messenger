import { createReducer,on } from '@ngrx/store';
import { User,State } from '../../../index.d'
import { setUser } from '../actions/user.actions';

var state:State = JSON.parse(localStorage.getItem("ngrx") as string)


export const userReducer = createReducer<User>(
  state?.user ?? {
    _id:null,
    profile:null,
  },

  on(setUser,(state:User,payload:User) => {
    return payload
  })
  

);

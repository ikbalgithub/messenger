import { createReducer,on } from '@ngrx/store';
import { User,State } from '../../../index.d'
import { set } from '../actions/user.actions';

var state:State = JSON.parse(localStorage.getItem("ngrx") as string)


export const userReducer = createReducer<User>(
  state?.user ?? {
    _id:null,
    profile:null,
    authorization:null
  },

  on(set,(state:User,payload:User) => {
    return payload
  })
  

);

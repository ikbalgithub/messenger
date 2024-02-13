import { createReducer,on } from '@ngrx/store';
import { Ngrx } from '../../../index.d'
import { setUser,setNull } from '../actions/user.actions';

var state = JSON.parse(localStorage.getItem("ngrx") as string)


export const userReducer = createReducer<Ngrx.User>(
  state?.user ?? {
    _id:null,
    profile:null,
  },

  on(setUser,(state:Ngrx.User,payload:Ngrx.User) => {
    return payload
  }),

  on(setNull,(state:Ngrx.User) => {
    return {
      _id:null,
      profile:null
    }
  })

);

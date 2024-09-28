import { createReducer,on } from '@ngrx/store';
import { Model, Ngrx } from '../../../index.d'
import { login,logout } from '../actions/user.actions';

var ngrx = localStorage.getItem("ngrx")

var state = parse<{user:Model.User}>(ngrx as string)

export const userReducer = createReducer<Model.User>(
  state?.user ?? {
    _id:false
  },

  on(login,(state:Model.User,payload:Model.User) => {
    return payload
  }),

  on(logout,(state:Model.User) => {
    return {
      _id:''
    }
  })
);

function parse<T>(jsonString:string):T{
  return JSON.parse(jsonString) as T
}
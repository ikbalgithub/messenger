import { createReducer,on } from '@ngrx/store';
import { setLogin,setLogout } from '../actions/authentication.actions';

var ngrx = localStorage.getItem("ngrx")
var state = parse<{authentication:{loggedIn:boolean}}>(ngrx as string)

export const authenticationReducer = createReducer<{loggedIn:boolean}>(
  state?.authentication ?? {loggedIn:false},

  on(setLogin,(state:{loggedIn:boolean}) => ({
    loggedIn:true
  })),

  on(setLogout,(state:{loggedIn:boolean}) => ({
    loggedIn:false
  }))
  
);

function parse<T>(jsonString:string):T{
  return JSON.parse(jsonString) as T
}
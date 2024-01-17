import { ActionReducer,Reducer,Action,ReducerTypes,ActionCreator,TypedAction,FunctionWithParametersType,ActionCreatorProps } from '@ngrx/store';
import { HttpErrorResponse,HttpEvent,HttpHeaders } from '@angular/common/http';
import { WritableSignal } from '@angular/core';


export interface User {
  _id:string|null,
  profile:Profile|null,
}

export interface Authenticated{
  _id:string,
  profile:Profile,
  authorization:string
}

export interface Authentication{
  loggedIn:boolean
}

export interface State {
  authentication:Authentication,
  authorization:string,
  user:User
}


export interface Profile{
  surname:string,
  profileImage:string,
  firstName:string,
  usersRef?:string
}

export interface Credential {
  username:string,
  password:string
}

export type Authorization = string | HttpHeaders

export namespace Message{
  interface Last{
    sendAt:number,
    read:boolean,
    contentType:string,
    description:string,
    unreadCounter:number
    value:string,
    groupId:string,
    sender:Profile,
    accept:Profile,
  }

  type All = {
    _id:string,
    sender:string,
    sendAt:number,
    value:string,
    groupId:string,
    accept:string,
    read:boolean,
    contentType:string,
    description:string,
    sent?:boolean
  }[]

  export type One = All[number]

  type New = {
    _id:string,
    value:string,
    accept:string,
    groupId:string,
    sendAt:number
  }

  type Update = {
    _id:string
  }
}


export namespace Request{

  type Get = (path:string,options?:any) => void

  type Post<Body> = (body:Body,options?:any) => void

  type Put<Body> = (body:Body,options?:any) => void

  type State<T> = WritableSignal<RequestState<T>>
  
  interface RequestConfig<Result>{
    cb?:(result:Result) => void,
    failedCb?:(err:HttpErrorResponse)=>void,
    state:State<Result>,
    path?:string
  }

  export interface RequestState<Result>{
    retryFunction?:() => void,
    running:boolean,
    error?:HttpErrorResponse,
    result?:Result
  }

}


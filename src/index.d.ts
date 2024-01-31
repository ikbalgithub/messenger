import { ActionReducer,Reducer,Action,ReducerTypes,ActionCreator,TypedAction,FunctionWithParametersType,ActionCreatorProps } from '@ngrx/store';
import { HttpErrorResponse,HttpEvent,HttpHeaders } from '@angular/common/http';
import { WritableSignal } from '@angular/core';
 
export type Authorization = string | HttpHeaders

export namespace Message{
  interface Last{
    _id?:string,
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

  export type Populated = One & {
    sender:Profile,
    accept:Profile
  }

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

export namespace Search{
  type Result = Profile & {
    message?:Message.Last
  }
}


export namespace Common{
  interface Profile{
    surname:string,
    profileImage:string,
    firstName:string,
    usersRef?:string,
    _id?:string,
  }

  export interface Authenticated{
    _id:string,
    profile:Profile,
    authorization:string
  }
}

export namespace Ngrx{
  export interface User {
    _id:string|null,
    profile:Common.Profile|null,
  }

  export interface Authentication{
    loggedIn:boolean
  }

  export interface State {
    authentication:Authentication,
    authorization:string,
    user:User
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


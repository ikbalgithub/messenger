import { ActionReducer,Reducer,Action,ReducerTypes,ActionCreator,TypedAction,FunctionWithParametersType,ActionCreatorProps } from '@ngrx/store';
import { HttpErrorResponse,HttpEvent,HttpHeaders } from '@angular/common/http';
import { WritableSignal } from '@angular/core';
 
// export type Authorization = string | HttpHeaders

export namespace Message{
  interface Last{
    _id?:string,
    sender:Common.Profile,
    accept:Common.Profile,
    sendAt:number,
    read:boolean,
    contentType:string,
    description:string,
    value:string,
    unreadCounter:number
    groupId:string,
    sent?:boolean,
    failed?:boolean
  }

  type All = {
    _id:string,
    sender:string
    accept:string,
    sendAt:number,
    read:boolean,
    contentType:string,
    description:string,
    value:string,
    groupId:string,
    sent?:boolean,
    failed?:boolean
  }[]

  export type One = All[number]

  export type Populated = One & {
    sender:Common.Profile,
    accept:Common.Profile
  }

  type New = {
    _id:string,
    value:string,
    accept:string,
    groupId:string,
    sendAt:number,
    description:string,
    contentType:string
  }

  type Update = {
    groupId:string,
    _id:string
  }
}

export namespace Search{
  type Result = Common.Profile & {
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

  interface Authenticated{
    _id:string,
    profile:Profile,
    authorization:string,
    username:string
  }

  interface Oauth{
    uid:string,
    profile:Omit<Profile,"_id|usersRef">
  }

  interface User{
    _id:string,
    profile:Profile,
    username:string
  }
}

export namespace Ngrx{
  export type History = Message.Last[]
  
  export interface User {
    _id:string|null,
    profile:Common.Profile|null,
    username:string|null
  }

  export interface Authentication{
    loggedIn:boolean
  }

  export interface State {
    authentication:Authentication,
    authorization:string,
    user:User,
    messages:Messages[],
    history:History
  }
  
  interface Messages{
    _id:string,
    detail:Message.All
  }
}

export namespace Request{

  type Get = (path:string,options?:any) => void

  type Post<Body> = (body:Body,options?:any) => void

  type Put<Body> = (body:Body,options?:any) => void

  type State<T> = WritableSignal<RequestState<T>>
  
  interface RequestConfig<Result>{
    cb?:(result:Result) => void,
    failedCb?:(err:HttpErrorResponse,other?:any)=>void,
    state:State<Result>,
    path?:string
  }

  export interface RequestState<Result>{
    running:boolean,
    isError:boolean,
    result:Result,
    message?:string,
    retryFunction?:Function
    
    // retryFunction?:() => void,
    // running:boolean,
    // error?:HttpErrorResponse,
    // result?:Result
  }

}


import { createAction, props } from "@ngrx/store";
import { Message, Model, Ngrx } from "../../..";

export const init = createAction('[Detail Component] Init',props<Cache>()) // works
export const add = createAction('[Detail Component] Add',props<{_id:string,newMessage:Message.One}>()) // works
export const successSend = createAction('[Detail Component] Success Send',props<{index:number,_id:string}>()) // works
export const updated = createAction('[Detail Component] Updated',props<{index:number,_id:string}>())
export const failedSend = createAction('[Detail Component] Failed Send',props<{index:number,_id:string}>())
export const resend = createAction('[Detail Component] Resend',props<{index:number,_id:string}>())
export const resetMessages = createAction('[Detail Component] Reset')

type Status = {older:boolean,received:boolean,sent?:boolean,failed?:boolean}
type Messages = (Model.Message<string,string> & Status)[]


export type Cache = {
  _id:string,
  messages:Messages
}
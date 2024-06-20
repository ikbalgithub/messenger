import { createAction, props } from "@ngrx/store";
import { Message, Ngrx } from "../../..";

export const init = createAction('[Detail Component] Init',props<Ngrx.Messages>()) // works
export const add = createAction('[Detail Component] Add',props<{index:number,newMessage:Message.One}>()) // works
export const successSend = createAction('[Detail Component] Success Send',props<{index:number,_id:string}>()) // works
export const updated = createAction('[Detail Component] Updated',props<{index:number,_id:string}>())
export const failedSend = createAction('[Detail Component] Failed Send',props<{index:number,_id:string}>())
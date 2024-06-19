import { createAction, props } from "@ngrx/store";
import { Message, Ngrx } from "../../..";

export const init = createAction('[Detail Component] Init',props<Ngrx.Messages>())
export const add = createAction('[Detail Component] Add',props<{index:number,newMessage:Message.One}>())
export const successSend = createAction('[Detail Component] Success Send',props<{index:number,_id:string}>())
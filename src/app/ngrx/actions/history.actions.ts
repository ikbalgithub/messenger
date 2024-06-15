import { createAction, props } from "@ngrx/store";
import { Message, Ngrx } from "../../..";

export const add = createAction('Detail Component [Add]',props<Ngrx.History>())
export const incomingMessage = createAction('Detail Component [Incoming Message]',props<IncomingMessage>())
export const failedSend = createAction('Detail Component [Failed Send]',props<{index:number, _id:string}>())
export const successSend = createAction('Detail Component [Success Send]',props<{index:number,_id:string}>())
export const seen = createAction('Detail Component [Seen]',props<{index:number,_id:string}>())
export const resend = createAction('Detail Component [Resend]',props<{index:number,_id:string}>())

export interface IncomingMessage{
  index:number,
  message:Message.One
}
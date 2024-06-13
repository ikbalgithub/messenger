import { createAction, props } from "@ngrx/store";
import { Message, Ngrx } from "../../..";

export const add = createAction('Message Component [Add]',props<Ngrx.History>())
export const incomingMessage = createAction('Message Component [IncomingMessage]',props<IncomingMessage>())
export const failedSend = createAction('Message Component [FailedSend]',props<{index:number, _id:string}>())
export const successSend = createAction('Message Component [SuccessSend]',props<{index:number,_id:string}>())
export const seen = createAction('Message Component [Seen]',props<{index:number,_id:string}>())

export interface IncomingMessage{
  index:number,
  message:Message.One
}
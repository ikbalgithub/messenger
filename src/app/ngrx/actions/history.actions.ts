import { createAction, props } from "@ngrx/store";
import { Message, Ngrx } from "../../..";

export const add = createAction('Message Component [Add]',props<Ngrx.History>())
export const incomingMessage = createAction('Message Component [IncomingMessage]',props<IncomingMessage>())

export interface IncomingMessage{
  index:number,
  message:Message.One
}
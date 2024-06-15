import { createAction,props } from "@ngrx/store";
import { Message } from "../../..";
import { create } from "domain";

export const add = createAction('Messages Component [Add]',props<{value:Message.Last[]}>())
export const message = createAction('Messages Component [New Message]',props<Message.Last>())
export const replace = createAction('Detail Component [Replace]',props<{index:number,message:Message.Last}>())
export const successSend = createAction('Detail Component [Preview Success Send]',props<{index:number}>())
export const failedSend = createAction('Detail Component [Preview Failed Send]',props<{index:number}>())
export const resend = createAction('Detail Component [Preview Resend]',props<{index:number}>())
export const seen = createAction('Any Component [Preview Seen]',props<{index:number}>())

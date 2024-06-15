import { createAction,props } from "@ngrx/store";
import { Message } from "../../..";

export const add = createAction('Messages Component [Add]',props<{value:Message.Last[]}>())
export const message = createAction('Messages Component [New Message]',props<Message.Last>())
export const replace = createAction('Detail Component [Replace]',props<{index:number,message:Message.Last}>())
export const successSend = createAction('Detail Component [Preview Success Send]',props<{index:number}>())
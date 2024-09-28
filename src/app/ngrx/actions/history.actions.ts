import { createAction, props } from "@ngrx/store";
import { Message, Ngrx } from "../../..";
import { Modified } from "../../components/history/history.component";

export const resetHistory = createAction('[History Component] Reset')
export const add = createAction('[History Component] Add',props<{v:Modified[]}>()) // works
export const replace = createAction('[History Component] Replace',props<{index:number,value:Modified}>()) // works
export const successSend = createAction('[History Component] Success Send',props<{index:number}>()) // works
export const updated = createAction('[History Component] Updated',props<{index:number}>()) // updated
export const failedSend = createAction('[History Component] Failed Send',props<{index:number}>()) // works
export const resend = createAction('[History Component] Resend',props<{index:number}>()) // works
export const resetCounter = createAction('[History Component] Reset Counter',props<{index:number}>()) // works
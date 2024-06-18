import { createAction, props } from "@ngrx/store";
import { Message, Ngrx } from "../../..";

export const add = createAction('[History Component] Add',props<{v:Ngrx.History}>())
export const replace = createAction('[History Component] Replace',props<{index:number,value:Message.Last}>())
export const successSend = createAction('[History Component] Success Send',props<{index:number}>())

import { createAction, props } from "@ngrx/store";
import { Message, Ngrx } from "../../..";
import { History } from "../../components/history/history.component";

export const resetHistory = createAction('[History Component] Reset')
export const add = createAction('[History Component] Add',props<{v:History}>()) // works

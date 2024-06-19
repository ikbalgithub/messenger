import { createAction, props } from "@ngrx/store";
import { Ngrx } from "../../..";

export const init = createAction('[Detail Component] Init',props<Ngrx.Messages>())
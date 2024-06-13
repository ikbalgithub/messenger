import { createAction, props } from "@ngrx/store";
import { Ngrx } from "../../..";

export const add = createAction('Message Component [Add]',props<Ngrx.History>())
import { createReducer,on } from "@ngrx/store";
import { Ngrx } from "../../..";
import { add } from "../actions/history.actions";

export const historyReducer = createReducer<Ngrx.History[]>(
  [],
  on(add,(state,payload) => [...state,payload])
)
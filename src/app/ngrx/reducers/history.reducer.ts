import { createReducer,on } from "@ngrx/store";
import { Ngrx } from "../../..";
import { add,incomingMessage } from "../actions/history.actions";

export const historyReducer = createReducer<Ngrx.History[]>(
  [],
  on(add,(state,payload) => [...state,payload]),
  on(incomingMessage,(state,payload) => {
    state[payload.index].messages.push(
      payload.message
    )

    return state
  })
)
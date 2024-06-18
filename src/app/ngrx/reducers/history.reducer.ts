import { createReducer, on } from "@ngrx/store";
import { Message } from "../../..";
import { add, replace } from "../actions/history.actions";

export const historyReducer = createReducer<Message.Last[]>(
  [],
  on(add,(state,payload) => {
    return [
      ...state,
      ...payload.v
    ]
  }),
  on(replace,(state,payload) => {
    state[payload.index] = {
      ...payload.value
    }
    return state
  })
)
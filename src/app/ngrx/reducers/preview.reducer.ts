import { createReducer,on } from "@ngrx/store";
import { Message } from "../../..";
import { add, message, replace } from "../actions/preview.action";

export const previewReducer = createReducer<Message.Last[]>(
  [],
  on(add,(state,payload) => {
    return payload.value
  }),
  on(message,(state,payload) => {
    return [...state,payload]
  }),
  on(replace,(state,payload) => {
     state[payload.index] = {
       ...payload.message
     }

     return state
  })
)
import { createReducer,on } from "@ngrx/store";
import { Message } from "../../..";
import { add, failedSend, message, replace, successSend } from "../actions/preview.action";

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
  }),
  on(successSend,(state,payload) => {
    state[payload.index] = {
      ...state[payload.index],
      sent:true,
      failed:false
    }
    return state
  }),
  on(failedSend,(state,payload) => {
    state[payload.index] = {
      ...state[payload.index],
      failed:false
    }

    return state
  })
)
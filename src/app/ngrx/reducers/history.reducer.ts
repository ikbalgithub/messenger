import { createReducer, on } from "@ngrx/store";
import { Message } from "../../..";
import { add, failedSend, replace, resend, resetCounter, successSend, updated } from "../actions/history.actions";

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
  }),
  on(successSend,(state,payload) => {
    state[payload.index] = {
      ...state[payload.index],
      sent:true
    }
    return state
  }),
  on(updated,(state,payload) => {
    var target = state[payload.index]
    if(target.sent) target.read = true
    state[payload.index] = {...target}
    return state
  }),
  on(failedSend,(state,payload) => {
    state[payload.index] = {
      ...state[payload.index],
      failed:true
    }
    return state
  }),
  on(resend,(state,payload) => {
    state[payload.index] = {
      ...state[payload.index],
      failed:false
    }
    return state
  }),
  on(resetCounter,(state,payload) => {
    state[payload.index] = {
      ...state[payload.index],
      unreadCounter:0
    }
    return state
  })
)
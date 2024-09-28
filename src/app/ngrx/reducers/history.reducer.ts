import { createReducer, on } from "@ngrx/store";
import { Message } from "../../..";
import { add, failedSend, replace, resend, resetHistory, successSend, updated } from "../actions/history.actions";
import { Modified } from "../../components/history/history.component";

export const historyReducer = createReducer<Modified[]>(
  JSON.parse(localStorage.getItem("ngrx") as string)?.history ?? [],
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
      status:{sent:true}
    }
    return state
  }),
  on(updated,(state,payload) => {
    var target = state[payload.index]
    if(target.status.sent) target.detail.read = true
    state[payload.index] = {...target}
    return state
  }),
  on(failedSend,(state,payload) => {
    state[payload.index] = {
      ...state[payload.index],
      status:{failed:true}
    }
    return state
  }),
  on(resend,(state,payload) => {
    state[payload.index] = {
      ...state[payload.index],
      status:{failed:false}
    }
    return state
  }),
  on(resetHistory,(state) => {
    return []
  })
)
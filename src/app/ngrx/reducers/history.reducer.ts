import { createReducer,on } from "@ngrx/store";
import { Ngrx } from "../../..";
import { add,incomingMessage,failedSend,successSend,seen } from "../actions/history.actions";

export const historyReducer = createReducer<Ngrx.History[]>(
  [],
  on(add,(state,payload) => [...state,payload]),
  on(incomingMessage,(state,payload) => {
    state[payload.index].messages.push(
      payload.message
    )
    return state
  }),
  on(seen,(state,payload) => {
    var {_id,messages} = state[
      payload.index
    ]
    
    var modifiedResult = messages.map(m => {
      if(!m.failed) m.read = true

      return m
    })

    state[payload.index] = {
      _id,
      messages:modifiedResult
    }
    
    return state
  }),
  on(successSend,(state,payload) => {
    var {_id,messages} = state[
      payload.index
    ]
    
    var [filter] = messages.filter(
      m => m._id === payload._id
    )

    var index = messages.findIndex(
      m => m._id === payload._id
    )

    messages[index] = {
      ...filter,
      sent:true,
      failed:false
    }

    return state
  }),
  on(failedSend,(state,payload) => {
    var {_id,messages} = state[
      payload.index
    ]
    
    var [filter] = messages.filter(
      m => m._id === payload._id
    )

    var index = messages.findIndex(
      m => m._id === payload._id
    )

    messages[index] = {
      ...filter,
      failed:true
    }

    state[payload.index] = {
      _id,
      messages
    }

    return state
  })
)
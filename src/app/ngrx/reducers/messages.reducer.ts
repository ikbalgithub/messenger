import { findIndex } from 'lodash'
import { createReducer, on } from "@ngrx/store";
import { Cache, add, failedSend, init, resend, resetMessages, updated } from "../actions/messages.actions";
import { successSend } from "../actions/messages.actions";

export const messagesReducer = createReducer<Cache[]>(
	JSON.parse(localStorage.getItem("ngrx") as string)?.messages ?? [],
	on(init,(state,payload) => {
		return [
			payload
		]
	}),
	on(add,(state,payload) => {		

		return state
	}),
	on(successSend,(state,payload) => {
    var updatedState = [...state]
    var target = updatedState[payload.index]
		var messages = [...target.messages]

    messages = messages.map(m => {
		  var modified = {...m}
			
			if(m._id === payload._id){
			  modified.failed = false
				modified.sent = true
			}

			return modified
		})

		updatedState[payload.index] = {
		  ...target,
			messages
		}

		return updatedState
	}),
	on(updated,(state,payload) => {
	  var updatedState = [...state]
		var target = updatedState[payload.index]
    var messages = [...target.messages]

		messages = messages.map(message => {
		  var modified = {...message}

			if(message.sender === payload._id){
			  if(!message.failed){
				  modified.read = true
				} 
			}

			return modified
		})

		updatedState[payload.index] = {
		  ...target,
			messages
		}

		return updatedState
	}),
	on(failedSend,(state,payload) => {
		var updatedState = [...state]
		var target = updatedState[payload.index]
    var messages = [...target.messages]

		messages = messages.map(message => {
		  var modified = {...message}

			if(message._id === payload._id){
			  modified.failed = true
			}

			return modified
		})

		updatedState[payload.index] = {
		  ...target,
			messages
		}

		return updatedState
	}),
	on(resend,(state,payload) => {
		// var target = state[payload.index]

		// target.messages = target.messages.map(m => {
		// 	if(m._id === payload._id){
		// 		m.failed = false
		// 	}
		// 	return m
		// })

		// state[payload.index] = target

		return state
	}),
	on(resetMessages,(state) => {
	  return []
	})
)
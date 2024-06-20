import { createReducer, on } from "@ngrx/store";
import { Ngrx } from "../../..";
import { add, failedSend, init, resend, updated } from "../actions/messages.actions";
import { successSend } from "../actions/messages.actions";

export const messagesReducer = createReducer<Ngrx.Messages[]>(
  [],
	on(init,(state,payload) => {
		return [
			...state,
			payload
		]
	}),
	on(add,(state,payload) => {
		state[payload.index].detail.push(
			payload.newMessage
		)
		return state
	}),
	on(successSend,(state,payload) => {
		var target = state[payload.index]

		target.detail = target.detail.map(m => {
			if(m._id === payload._id){
				m.failed = false
				m.sent = true
			}
			return m
		})
    state[payload.index] = target
		return state
	}),
	on(updated,(state,payload) => {
		var target = state[payload.index]

    target.detail = target.detail.map(m => {
			if(m.sender.usersRef === payload._id){
				if(!m.failed) m.read = true
			}

			return m
		})

		state[payload.index] = target
		return state
	}),
	on(failedSend,(state,payload) => {
		var target = state[payload.index]

		target.detail = target.detail.map(m => {
			if(m._id === payload._id){
				m.failed = true
			}
			return m
		})
    
		state[payload.index] = target

		return state
	}),
	on(resend,(state,payload) => {
		var target = state[payload.index]

		target.detail = target.detail.map(m => {
			if(m._id === payload._id){
				m.failed = false
			}
			return m
		})

		return state
	})
)
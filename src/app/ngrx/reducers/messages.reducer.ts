import { createReducer, on } from "@ngrx/store";
import { Ngrx } from "../../..";
import { add, init } from "../actions/messages.actions";

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
	})
)
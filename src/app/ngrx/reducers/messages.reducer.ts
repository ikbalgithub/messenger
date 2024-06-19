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
		var {_id,detail} = state[
			payload.index
		]

		var added = [
			...detail,
			payload.newMessage
		]

		state[payload.index] = {
			_id,
			detail:[...added]
		}
		
		
		return state
	})
)
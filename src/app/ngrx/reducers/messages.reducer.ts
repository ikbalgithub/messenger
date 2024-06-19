import { createReducer, on } from "@ngrx/store";
import { Ngrx } from "../../..";
import { init } from "../actions/messages.actions";

export const messagesReducer = createReducer<Ngrx.Messages[]>(
  [],
	on(init,(state,payload) => {
		return [
			...state,
			payload
		]
	})
)
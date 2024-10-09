import { createReducer, on } from "@ngrx/store";
import { Message } from "../../..";
import { add, resetHistory } from "../actions/history.actions";
import { History } from "../../components/history/history.component";

export const historyReducer = createReducer<History>(
  JSON.parse(localStorage.getItem("ngrx") as string)?.history ?? [],
  on(add,(state,payload) => {
    return [
      ...state,
      ...payload.v
    ]
  }),
  on(resetHistory,(state) => {
    return []
  })
)
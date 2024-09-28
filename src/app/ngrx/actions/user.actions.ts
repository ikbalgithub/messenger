import { createAction,props } from '@ngrx/store';
import { Model, Ngrx } from '../../../index.d'

export const login = createAction('[Login Component] Login',props<User>());
export const logout = createAction('[Any Component] Login');

export type User = {
  _id:string,
  profile:Model.Profile
}
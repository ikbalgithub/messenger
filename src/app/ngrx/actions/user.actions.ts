import { createAction,props } from '@ngrx/store';
import { User } from '../../../index.d'

export const setUser = createAction('[Login Component] Set',props<User>());
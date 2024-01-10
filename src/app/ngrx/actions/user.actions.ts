import { createAction,props } from '@ngrx/store';
import { User } from '../../../index.d'

export const set = createAction('[Login Component] Set',props<User>());
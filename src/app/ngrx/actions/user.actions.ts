import { createAction,props } from '@ngrx/store';
import { Ngrx } from '../../../index.d'

export const setUser = createAction('[Login Component] Set',props<Ngrx.User>());
export const setNull = createAction('[Navbar Component] Unset');


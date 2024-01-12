import { createAction,props } from '@ngrx/store';

export const setAuthorization = createAction(
  '[Login Component] Set Authorization',
  props<{authorization:string}>()
);

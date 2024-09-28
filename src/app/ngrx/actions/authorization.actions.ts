import { createAction,props } from '@ngrx/store';

export const setAuthorization = createAction(
  '[Login Component] Set Authorization',
  props<{authorization:string}>()
);

export const reset = createAction(
  '[Any Component] Reset',
);

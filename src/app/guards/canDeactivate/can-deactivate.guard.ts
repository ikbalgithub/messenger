import { Observable } from 'rxjs';
import { CanDeactivateFn,UrlTree } from '@angular/router';

export interface CanComponentDeactivate{
  canDeactivate:() => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}

export const canDeactivateGuard: CanDeactivateFn<unknown> = (component, currentRoute, currentState, nextState) => {
  return true;
};

import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';

export const systemTitleResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  if (route.params['waypointSymbol'] != null) {
    return `Waypoints - ${route.params['waypointSymbol']}`;
  }
  if (route.params['systemSymbol'] != null) {
    return `Systems - ${route.params['systemsSymbol']}`
  }
  return `Systems`;
};

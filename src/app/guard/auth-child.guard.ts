import { CanActivateFn } from '@angular/router';
import {authGuard} from "./auth.guard";

export const authChildGuard: CanActivateFn = (route, state) => {
  return authGuard(route, state);
};

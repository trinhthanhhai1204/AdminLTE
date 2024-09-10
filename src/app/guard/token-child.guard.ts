import { CanActivateFn } from '@angular/router';
import {tokenGuard} from "./token.guard";

export const tokenChildGuard: CanActivateFn = (route, state) => {
  return tokenGuard(route, state);
};

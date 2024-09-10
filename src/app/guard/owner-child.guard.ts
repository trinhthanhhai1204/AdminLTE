import { CanActivateFn } from '@angular/router';
import {ownerGuard} from "./owner.guard";

export const ownerChildGuard: CanActivateFn = (route, state) => {
  return ownerGuard(route, state);
};

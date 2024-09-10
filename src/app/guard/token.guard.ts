import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const tokenGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService);
  authService.refreshToken();
  return true;
};

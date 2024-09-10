import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  let authService = inject(AuthService);
  return !!authService.getAuth() && !!authService.getToken() ?
    true : router.navigate(["/login"]);
};

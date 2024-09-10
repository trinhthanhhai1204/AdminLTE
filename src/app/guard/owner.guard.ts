import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const ownerGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  let authService = inject(AuthService);
  let role = authService.getRole();
  return role == "OWNER"  ? true : router.navigate(["/404"]);
};

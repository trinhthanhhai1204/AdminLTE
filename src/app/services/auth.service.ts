import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  authenticate(req: any): Observable<any> {
    return this.http.post<any>(
      "http://localhost:8080/api/v1/auth/authenticate",
      req
    );
  }

  refreshToken(): void {
    if (this.getAuth()) {
      let currentUser: any = this.getAuth();
      let remaining = currentUser.exp - new Date().getTime();
      let expectTime = 1000 * 60 * 60 * 24 * 6;
      if (remaining > 0) {
        if (remaining < expectTime) {
          this.http.post<any>("http://localhost:8080/api/v1/auth/refresh-token",null, {
            headers: {
              "Authorization": `Bearer ${this.getToken()}`
            }
          }).subscribe((jwt: any) => {
            this.handleLogin(jwt);
          });
        }
      } else {
        this.handleLogout();
      }
    }
  }

  getToken() : any {
    return localStorage.getItem("samanhua-shop-admin-token");
  }

  getAuth(): any {
    let s = localStorage.getItem("samanhua-shop-current-admin");
    return s ? JSON.parse(s) : null;
  }

  getRole(): any {
    let auth = this.getAuth();
    return auth ? auth.role : null;
  }

  handleLogin(jwt: any): void {
    let {avatar, exp, id, role, subject, token} = jwt;
    let userInfo: any = {avatar, exp: new Date(exp).getTime(), id, role, subject}
    localStorage.setItem("samanhua-shop-admin-token", token);
    localStorage.setItem("samanhua-shop-current-admin", JSON.stringify(userInfo));
  }

  handleLogout(): void {
    localStorage.removeItem("samanhua-shop-admin-token");
    localStorage.removeItem("samanhua-shop-current-admin");
  }
}

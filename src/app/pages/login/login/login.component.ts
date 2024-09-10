import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {FormsModule, NgForm} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {ToastService} from "../../../services/toast.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    NgClass
  ],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {
  username: string = "owner";
  password: string = "ownerPass";
  wasValidated: boolean = false;

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {
  }

  authenticate(login: NgForm) {
    this.wasValidated = true;
    if (login.valid) {
      let req = {
        username: this.username,
        password: this.password,
      }
      this.authService.authenticate(req).subscribe({
        next: (res: any) => {
          if (res.role !== "USER") {
            this.authService.handleLogin(res);
            this.toastService.makeSuccessToast("Đăng nhập thành công!");
            this.router.navigate(["/"]);
          }
          else {
            this.toastService.makeErrorToast("Bạn không có quyền truy cập vào trang này!");
          }
        },
        error: (err) => {
          if (err.status === 403) {
            this.toastService.makeErrorToast("Tên đăng nhập hoặc mật khẩu không chính xác!");
          }
        }
      });
    }
    else {
      this.toastService.makeErrorToast("Các trường chưa được nhập hợp lệ!");
    }

  }
}

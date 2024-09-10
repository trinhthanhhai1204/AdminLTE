import { Injectable } from '@angular/core';
import {SweetAlertOptions} from "sweetalert2";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toast: BehaviorSubject<SweetAlertOptions> = new BehaviorSubject<any>(null);
  toastObservable: Observable<SweetAlertOptions> = this.toast.asObservable();

  constructor() { }

  makeToast(toast: SweetAlertOptions) {
    this.toast.next(toast);
  }

  makeSuccessToast(title: string) {
    this.toast.next({icon: "success", title});
  }

  makeErrorToast(title: string) {
    this.toast.next({icon: "error", title});
  }

  makeWarningToast(title: string) {
    this.toast.next({icon: "warning", title});
  }

  makeOrderToast(id: number, status: number) {
    if (status === 2) {
      this.makeSuccessToast(`Đã xác nhận đơn hàng số ${id}!`);
    } else if (status === 3) {
      this.makeSuccessToast(`Đã bắt đầu giao đơn hàng số ${id}!`);
    } else if (status === 4) {
      this.makeSuccessToast(`Đã hoàn thành đơn hàng số ${id}!`);
    } else if (status === 5) {
      this.makeSuccessToast(`Đã huỷ đơn hàng số ${id}!`);
    }
  }
}

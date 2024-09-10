import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  getOrderStatusList(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8080/api/v1/admin/all-order-status")
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/v1/orders/${id}`);
  }

  getOrders(status: string, currentPage: number, size: number, sort: number) {
    let init = "http://localhost:8080/api/v1/orders" + (status !== "" ? `/by-status/${status}` : "");
    let query = [];
    if (currentPage !== 0) {
      query.push(`page=${currentPage}`);
    }
    query.push(`size=${size}`);
    switch (sort) {
      case 2:
        query.push(`sort=createAt,desc`);
        break;
      default:
        query.push(`sort=createAt,asc`);
        break;
    }
    return this.http.get<any[]>(init + "?" + query.join("&"));
  }

  getOrdersByCustomerId(customerId: number, status: string, currentPage: number, size: number, sort: number) {
    let init = `http://localhost:8080/api/v1/orders/by-customer-lazy/${customerId}` + (status !== "" ? `/by-status/${status}` : "");
    let query = [];
    if (currentPage !== 0) {
      query.push(`page=${currentPage}`);
    }
    query.push(`size=${size}`);
    switch (sort) {
      case 2:
        query.push(`sort=createAt,desc`);
        break;
      default:
        query.push(`sort=createAt,asc`);
        break;
    }
    return this.http.get<any[]>(init + "?" + query.join("&"));
  }

  getCount(status: string): Observable<number> {
    return this.http.get<number>("http://localhost:8080/api/v1/orders/count" + (status !== "" ? `/by-status/${status}` : ""));
  }

  getCountByCustomerId(customerId: number, status: string) {
    return this.http.get<number>(`http://localhost:8080/api/v1/orders/count/by-customer/${customerId}` + (status !== "" ? `/by-status/${status}` : ""));
  }

  updateOrderStatus(id: number, status: number): Observable<any> {
    return this.http.put(`http://localhost:8080/api/v1/orders/by-status/${id}?status=${status}`, null)
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderDetailService {

  constructor(private http: HttpClient) { }

  getOrderDetailsByOrder(orderId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/order-details/by-order/${orderId}`)
      .pipe(map((orderDetails: any[]) => {
        return orderDetails.map((orderDetail: any) => {
          orderDetail.option.image = `http://localhost:8080/api/v1/file${orderDetail.option.image}`;
          orderDetail.option.book.image = `http://localhost:8080/api/v1/file${orderDetail.option.book.image}`;
          return orderDetail;
        });
      })
    );
  }

  getOrderDetailsCountByOrder(orderId: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/api/v1/order-details/count/by-order/${orderId}`);
  }

  getRevenuesOfCustomerById(customerId: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/api/v1/order-details/revenues-of-customer/${customerId}`)
  }
}

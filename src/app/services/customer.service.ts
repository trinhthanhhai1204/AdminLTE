import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8080/api/v1/admin/all-roles");
  }

  getCustomerById(id: number): Observable<any> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/customers/${id}`).pipe(
      map((customer: any) => {
        customer.image = `http://localhost:8080/api/v1/file${customer.image}`;
        return customer;
      })
    );
  }

  getCustomerSidebar(id: number): Observable<any> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/customers/lazy/${id}`).pipe(
      map((customer: any) => {
        customer.image = `http://localhost:8080/api/v1/file${customer.image}`;
        return customer;
      })
    );
  }

  getCustomers(role: number, page: number, size: number, sort: number): Observable<any> {
    let init = `http://localhost:8080/api/v1/customers/by-role/${role}`;
    let query = [];
    if (page !== 0) {
      query.push(`page=${page}`);
    }
    query.push(`size=${size}`);

    switch (sort) {
      default:
        query.push(`sort=id,asc`);
        break;
    }
    init = init + "?" + query.join("&");
    return this.http.get<any[]>(init).pipe(
      map((customers: any[]) => {
        return customers.map((customer: any) => {
          customer.image = `http://localhost:8080/api/v1/file${customer.image}`;
          return customer;
        })
      })
    );
  }

  getCustomersCount(role: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/api/v1/customers/count/by-role/${role}`);
  }

  saveCustomer(customer: any): Observable<any> {
    return this.http.post("http://localhost:8080/api/v1/customers", customer);
  }

  updateCustomer(id: number, customer: any): Observable<any> {
    return this.http.put(
      `http://localhost:8080/api/v1/customers/${id}`,
      customer,
      {observe: 'response'}
    );
  }

  deleteCustomer(id: number) {
    return this.http.delete(
      `http://localhost:8080/api/v1/customers/${id}`,
      {observe: 'response'}
    );
  }
}

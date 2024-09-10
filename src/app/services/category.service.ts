import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategoryById(id: number): Observable<any> {
    return this.http.get(`http://localhost:8080/api/v1/categories/${id}`)
  }

  getAllCategories(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8080/api/v1/categories/all");
  }

  getCategories(page: number, size: number, sort: number): Observable<any[]> {
    let init = "http://localhost:8080/api/v1/categories";
    let query = [];
    if (page !== 0) {
      query.push(`page=${page}`);
    }
    query.push(`size=${size}`);
    switch (sort) {
      case 2:
        query.push(`sort=id,desc`);
        break;
      default:
        query.push(`sort=id,asc`);
        break;
    }
    init = init + "?" + query.join("&");
    return this.http.get<any[]>(init).pipe(
      map((categories: any[]) => {
        return categories.map((category: any) => {
          category.image = `http://localhost:8080/api/v1/file${category.image}`;
          return category;
        });
      })
    );
  }

  getCategoriesByBookId(bookId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/categories/by-book/${bookId}`);
  }

  getCount(): Observable<number> {
    return this.http.get<number>("http://localhost:8080/api/v1/categories/count");
  }

  saveCategory(category: any): Observable<any> {
    return this.http.post("http://localhost:8080/api/v1/categories", category);
  }

  updateCategory(id: number, category: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/v1/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/api/v1/categories/${id}`);
  }
}

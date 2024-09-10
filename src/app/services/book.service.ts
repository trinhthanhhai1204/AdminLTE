import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  getBooks(currentCategory: number, currentPage: number, size: number, currentSort: number): Observable<any[]> {
    let init = "http://localhost:8080/api/v1/books" + ((currentCategory !== 0) ? `/by-category/${currentCategory}`: "");
    let query = [];
    if (currentPage !== 0) {
      query.push(`page=${currentPage}`);
    }
    query.push(`size=${size}`);
    switch (currentSort) {
      case 2:
        query.push(`sort=id,asc`);
        break;
      case 3:
        query.push(`sort=price,desc`);
        break;
      case 4:
        query.push(`sort=price,asc`);
        break;
      default:
        query.push(`sort=id,desc`);
        break;
    }
    init = init + "?" + query.join("&");
    return this.http.get<any[]>(init).pipe(
      map((books: any[]) => {
        return books.map((book: any) => {
          book.image = `http://localhost:8080/api/v1/file${book.image}`;
          return book;
        })
      })
    );
  }

  getBooksCount(currentCategory: number): Observable<number> {
    return this.http.get<number>("http://localhost:8080/api/v1/books/count" + (currentCategory === 0 ? "" : `/by-category/${currentCategory}`))
  }

  getBookById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/v1/books/${id}`).pipe(
      map((book: any) => {
        book.image = `http://localhost:8080/api/v1/file${book.image}`;
        return book;
      }),
    );
  }

  getBookByOptionId(id: number): Observable<any> {
    return this.http.get(`http://localhost:8080/api/v1/books/by-option/${id}`)
      .pipe(
        map((book: any) => {
          book.options = book.options.map((option: any) => {
            option.image = `http://localhost:8080/api/v1/file${option.image}`;
            return option;
          });
          return book;
        })
      );
  }

  saveBook(book: any): Observable<any> {
    return this.http.post<any>(`http://localhost:8080/api/v1/books`, book)
  }

  updateBook(id: number, book: any): Observable<any> {
    return this.http.put<any>(`http://localhost:8080/api/v1/books/${id}`, book);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete<any>(`http://localhost:8080/api/v1/books/${id}`);
  }
}

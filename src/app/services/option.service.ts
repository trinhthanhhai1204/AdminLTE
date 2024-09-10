import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OptionService {

  constructor(private http: HttpClient) {
  }

  getOptionById(id: number): Observable<any> {
    return this.http.get(`http://localhost:8080/api/v1/options/${id}`);
  }

  getOptionsByBookId(id: number, page: number, size: number): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:8080/api/v1/options/by-book/${id}?page=${page}&size=${size}`
    ).pipe(map((options: any[]) => {
        return options.map((option: any) => {
          option.image = `http://localhost:8080/api/v1/file${option.image}`;
          return option;
        });
      }));
  }

  getCountByBookId(id: number): Observable<number> {
    return this.http.get<number>(`http://localhost:8080/api/v1/options/count/by-book/${id}`);
  }

  saveOption(option: any): Observable<any> {
    return this.http.post(
      "http://localhost:8080/api/v1/options",
      option,
      {observe: "response"}
    )
  }

  updateOption(id: number, option: any): Observable<any> {
    return this.http.put<any>(
      `http://localhost:8080/api/v1/options/${id}`,
      option,
      {observe: "response"}
    )
  }

  deleteOption(id: number): Observable<any> {
    return this.http.delete(
      `http://localhost:8080/api/v1/options/${id}`,
      {observe: "response"}
    )
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {UtilService} from "./util.service";

@Injectable({
  providedIn: 'root'
})
export class StatisticalService {

  constructor(private http: HttpClient, private utilService: UtilService) { }

  getOutOfStock(page: number, size: number): Observable<any[]> {
    let init = "http://localhost:8080/api/v1/admin/out-of-stock";
    let query = [];
    if (page !== 0) {
      query.push(`page=${page}`);
    }
    query.push(`size=${size}`);
    return this.http.get<any[]>(init + "?" + query.join("&")).pipe(
      map((books: any[]) => {
        return books.map((book: any) => {
          book.image = `http://localhost:8080/api/v1/file${book.image}`;
          book.options[0].image = `http://localhost:8080/api/v1/file${book.options[0].image}`;
          return book;
        });
      })
    );
  }

  getCountOutOfStock(): Observable<number> {
    return this.http.get<number>("http://localhost:8080/api/v1/admin/out-of-stock/count");
  }

  getCountValuableCustomer(): Observable<number> {
    return this.http.get<number>("http://localhost:8080/api/v1/admin/valuable-customer/count");
  }

  getDataByDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/admin/statistical/revenue-by-date?date=${date}`);
  }

  getDataByMonth(month: number, year: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/admin/statistical/revenue-by-month?month=${month}&year=${year}`).pipe(
      map((data: any[]) => {
        let date = new Date();
        let currentYear = date.getFullYear();
        let currentMonth = date.getMonth() + 1;
        let currentDate = date.getDate();

        let dates!: string[];
        if (month === currentMonth && year === currentYear) {
          dates = [];
          let it = new Date(year, month - 1, 1);
          while (it.getDate() <= currentDate) {
            dates.push(this.utilService.parseDate(it));
            it = new Date(it.getTime() + 1000 * 60 * 60 * 24);
          }
        }
        else {
          dates = this.utilService.getDaysOfMonth(month, year);
        }

        return dates.map((date: string) => {
          let find = data.find(value => {
            return value.date === date;
          });
          return find ?
            {
              date: find.date,
              revenue: find.revenue
            } :
            {
              date,
              revenue: 0
            };
        })
      })
    );
  }

  getDataByYear(year: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/admin/statistical/revenue-by-year?year=${year}`).pipe(
      map((data: any[]) => {
        let date = new Date();
        let currentYear = date.getFullYear();
        let currentMonth = date.getMonth() + 1;

        let months!: number[];
        if (currentYear == year) {
          months = [];
          for (let i = 0; i < currentMonth; i++) {
            months.push(i);
          }
        }
        else {
          months = this.utilService.getMonthsOfYear();
        }
        return months.map((monthOfYear: number) => {
          let find = data.find((value: any) => {
            return value.month == monthOfYear + 1 && value.year == year;
          });
          return {
            month: monthOfYear + 1,
            year,
            revenue: find ? find.revenue : 0
          };
        });
      })
    );
  }

  getDataAllTime(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8080/api/v1/admin/statistical/revenue-all-time");
  }

  getDataByProvince(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8080/api/v1/admin/statistical/revenue-by-province")
  }

  getDataByDistrict(provinceId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/admin/statistical/revenue-by-district/${provinceId}`);
  }

  getDataByWard(districtId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/admin/statistical/revenue-by-ward/${districtId}`);
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {UtilService} from "./util.service";

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  constructor(private http: HttpClient, private utilService: UtilService) {
  }

  getDataByDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/admin/revenue-by-date?date=${date}`)
      .pipe(map((data: any[]) => {
        return this.utilService.getHour().map((hour: any) => {
          let find = data.find((value: any) => {
            return value.hour === hour;
          });
          return find ? {
            x: `${date} ${this.utilService.padStart(hour)}:00:00`,
            y: find.revenue
          } : {
            x: `${date} ${this.utilService.padStart(hour)}:00:00`,
            y: 0
          };
        });
      }));
  }

  getDataByWeek(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8080/api/v1/admin/revenue-by-week")
      .pipe(map((data: any[]) => {
        return this.utilService.getWeek().map((date: any) => {
          let find = data.find((value: any) => {
            return value.date === date;
          });
          return find ? {
            x: find.date,
            y: find.revenue
          } : {
            x: date,
            y: 0
          };
        });
      }));
  }

  getDataByMonth(month: number, year: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/admin/revenue-by-month?month=${month}&year=${year}`).pipe(
      map((data: any[]) => {
        return this.utilService.getDaysOfMonth(month, year).map((date: string) => {
          let find = data.find(value => {
            return value.date === date;
          });
          return find ?
            {
              x: find.date,
              y: find.revenue
            } : {
              x: date,
              y: 0
          };
        })
      })
    );
  }

  getDataByYear(year: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/admin/revenue-by-year?year=${year}`).pipe(map((data: any[]) => {
      return this.utilService.getMonthsOfYear().map((monthOfYear: number) => {
        let find = data.find((value: any) => {
          return value.month == monthOfYear + 1 && value.year == year;
        });
        return {
          x: this.utilService.parseDate(new Date(year, monthOfYear, 1)),
          y: find ? find.revenue : 0
        };
      })
    }));
  }

  getDataAllTime(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/admin/revenue-all-time`).pipe(
      map((data: any[]) => {
        let years = data.map(({year}) => year).sort((a, b) => a - b);
        let min = years[0];
        let max = years[years.length - 1];
        return this.utilService.fillYear(min, max).map((year: number) => {
          let find = data.find((value: any) => {
            return value.year === year;
          });
          return {
            x: this.utilService.parseDate(new Date(year, 0, 1)),
            y: find? find.revenue: 0
          }
        });
      })
    )
  }

  getChartUserProvince(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8080/api/v1/admin/chart/user-province").pipe(
      map((data: any[]) => data.map((row: any) => ({x: row.name, y: row.count})))
    );
  }

  getChartUserDistrict(provinceId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/admin/chart/user-district/${provinceId}`).pipe(
      map((data: any[]) => data.map((row: any) => ({x: row.name, y: row.count})))
    );
  }

  getChartUserWard(districtId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/admin/chart/user-ward/${districtId}`).pipe(
      map((data: any[]) => data.map((row: any) => ({x: row.name, y: row.count})))
    );
  }

  getChartRevenueByCategory(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/admin/chart/revenue-by-category`).pipe(
      map((data: any[]) => data.map((row: any) => ({x: row.name, y: row.revenue})))
    );
  }
}

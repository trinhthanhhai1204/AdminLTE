import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) {
  }

  getProvinces(): Observable<any[]> {
    return this.http.get<any[]>("http://localhost:8080/api/v1/provinces");
  }

  getDistricts(provinceId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/districts/by-province/${provinceId}`);
  }

  getWards(districtId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/wards/by-district/${districtId}`);
  }
}

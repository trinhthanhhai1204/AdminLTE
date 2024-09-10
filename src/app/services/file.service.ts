import {Injectable} from '@angular/core';
import {concatMap, from, map, Observable, toArray} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  upload(base64: string): Observable<any> {
    let base64Data = base64.split(",")[1];
    let type = base64.split(";")[0].split(":")[1];
    return this.http.post<any>(
      "http://localhost:8080/api/v1/file",
      {base64Data, type}
    );
  }

  uploadMultiple(files: string[]): Observable<string[]> {
    return from(files).pipe(
      concatMap((base64: string) => this.upload(base64)),
      map((image: any) => image.url),
      toArray()
    );
  }
}

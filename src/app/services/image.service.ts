import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) {
  }

  getImagesByBookId(id: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/v1/images/by-book/${id}`)
      .pipe(map((images: any[]) => images.map((image: any) => {
        return {
          id: image.id, src: `http://localhost:8080/api/v1/file${image.src}`
        };
      })));
  }

  addImage(image: any): Observable<any> {
    return this.http.post<any>(
      "http://localhost:8080/api/v1/images",
      image
    );
  }


  deleteImage(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/v1/images/${id}`);
  }
}

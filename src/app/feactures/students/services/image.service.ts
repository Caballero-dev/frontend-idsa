import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private readonly API_URL = `${environment.URL_API}/image`;
  private http: HttpClient = inject(HttpClient);

  getImage(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' });
  }

  getImageByName(name: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}/${name}`, { responseType: 'blob' });
  }
}


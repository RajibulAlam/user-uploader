import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserUploadService {
  // separate config file or env
  private apiUrl = 'http://localhost:9080/api/users';

  constructor(private http: HttpClient) { }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('headerFormat', 'Default');

    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/upload`, formData, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all-users`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}

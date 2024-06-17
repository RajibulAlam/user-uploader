import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserDTO} from "./dto/UserDTO";

@Injectable({
  providedIn: 'root'
})
export class UserUploadService {
  // separate config file or env
  private apiUrl = 'http://localhost:9080/api/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.apiUrl}/all-users`).pipe(
      catchError(this.handleError)
    );
  }

  uploadFile(file: File, headerFormat: string): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('headerFormat', headerFormat);

    return this.http.post<void>(`${this.apiUrl}/upload`, formData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(`Error Code: ${error.status}\nMessage: ${error.message}`);
    return throwError(() => new Error('An error occurred while processing the request.'));
  }
}

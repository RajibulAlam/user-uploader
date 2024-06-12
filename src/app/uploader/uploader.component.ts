import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { UserUploadService } from '../user-upload.service';
import { ReactiveFormsModule } from '@angular/forms';
import {BehaviorSubject, of} from "rxjs";
import {catchError} from "rxjs/operators";

@Component({
  selector: 'app-user-upload',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {
  displayedColumns: string[] = ['name', 'email'];
  private usersSubject = new BehaviorSubject<any[]>([]);
  dataSource = new MatTableDataSource<any>();

  constructor(private userUploadService: UserUploadService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.userUploadService.uploadFile(file).subscribe(
        () => {
          // Handle successful upload
          this.loadUsers();
        },
        (error) => {
          // Handle error
          console.error('Error uploading file', error);
        }
      );
    }
  }

  loadUsers(): void {
    this.userUploadService.getUsers().pipe(
      catchError(error => {
        // Handle error
        console.error('Error fetching users', error);
        return of([]);
      })
    ).subscribe(users => {
      this.dataSource.data = users;
    });
  }
}

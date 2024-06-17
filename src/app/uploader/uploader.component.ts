import { Component, OnInit } from '@angular/core';
import { UserUploadService } from '../user-upload.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { UserDTO } from '../dto/UserDTO';

@Component({
  selector: 'app-user-upload',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatTableModule, CommonModule, ReactiveFormsModule]
})
export class UploaderComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'age', 'userType'];
  dataSource = new MatTableDataSource<UserDTO>();
  fileForm: FormGroup;
  fileError: string | null = null;

  constructor(private userUploadService: UserUploadService, private fb: FormBuilder) {
    this.fileForm = this.fb.group({
      file: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('file', file);
      const isValidType = file.name.endsWith('.csv');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5 MB limit
      if (isValidType && isValidSize) {
        this.fileForm.controls['file'].setValue(file); // Set the form control value if valid
        this.fileError = null; // Clear any previous file error

        this.userUploadService.uploadFile(file,'Default').subscribe(
          () => {
            this.loadUsers();
          },
          (error) => {
            console.error('Error uploading file', error);
          }
        );
      } else {
        this.fileForm.controls['file'].setErrors({ invalidFile: true });
        this.fileError = 'Invalid file. Please upload a valid CSV file.';
      }
    }
  }

  loadUsers(): void {
    this.userUploadService.getUsers().pipe(
      catchError(error => {
        console.error('Error fetching users', error);
        return of([]);
      })
    ).subscribe(users => {
      this.dataSource.data = users;
    });
  }
}

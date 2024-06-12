import { Route } from '@angular/router';
import { UploaderComponent } from './uploader/uploader.component';

export const routes: Route[] = [
  { path: '', redirectTo: '/upload', pathMatch: 'full' },
  { path: 'uploader', component: UploaderComponent },
];

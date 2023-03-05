import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core'
//compoments
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

import { HttpClientModule } from '@angular/common/http';
import { ActivityLogsComponent } from './components/activity-logs/activity-logs.component';
import { LoginComponent } from './components/login/login.component';
import { RequestInterceptorProvider } from './interceptors/request-interceptor.interceptor';
import { ActivitiesDialogModalComponent } from './components/activities-dialog-modal/activities-dialog-modal.component';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS
} from '@angular/material-moment-adapter'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { UpdateActiviesModalDialogComponent } from './components/update-activies-modal-dialog/update-activies-modal-dialog.component';
import { DeleteActivitiesModalComponent } from './components/delete-activities-modal/delete-activities-modal.component';
import { ActivitiesTimerComponent } from './components/activities-timer/activities-timer.component';
import { MessageComponent } from './components/message/message.component'

export const MY_FORMATS = {
  parse: {
      dateInput: 'DD/MM/YYYY',
  },
  display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [AppComponent, ActivityLogsComponent, LoginComponent, ActivitiesDialogModalComponent, UpdateActiviesModalDialogComponent, DeleteActivitiesModalComponent, ActivitiesTimerComponent, MessageComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatNativeDateModule,
    NgxPaginationModule
  ],
  providers: [
    RequestInterceptorProvider,
    {
      provide: MAT_DATE_FORMATS, 
      useValue:'pt-br' 
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] 
    },
    {
      provide: MAT_DATE_FORMATS, 
      useValue: MY_FORMATS
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

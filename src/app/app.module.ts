import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

import { ChartComponent } from '../app/chart/chart.component';


import { AppComponent } from './app.component';
import { UserInputComponent } from './components/user-input/user-input.component';
import { WorkoutListComponent } from './components/workout-list/workout-list.component';
import { WorkoutService } from './services/workout.service';




@NgModule({
  declarations: [
    AppComponent,
    UserInputComponent,
    WorkoutListComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  providers: [WorkoutService],
  bootstrap: [AppComponent]
})
export class AppModule { }

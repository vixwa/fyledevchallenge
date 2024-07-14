import { Component, EventEmitter, Output } from '@angular/core';
import { WorkoutService } from '../../services/workout.service';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})
export class UserInputComponent {
  userName: string = '';
  workoutType: string = '';
  workoutMinutes: number | null = null;
  
  workoutTypes: string[] = ['Running', 'Cycling', 'Swimming', 'Yoga','Football'];

  @Output() workoutAdded = new EventEmitter<any>();

  constructor(private workoutService: WorkoutService) { }

  addWorkout() {
    if (this.userName && this.workoutType && this.workoutMinutes) {
      const newWorkout = {
        name: this.userName,
        workout: {
          type: this.workoutType,
          count: 1,
          minutes: this.workoutMinutes
        }
      };
      this.workoutService.addWorkout(
        this.userName,
        this.workoutType,
        this.workoutMinutes
      );
      this.workoutAdded.emit(newWorkout);
      this.userName = '';
      this.workoutType = '';
      this.workoutMinutes = null;
    }
  }
}
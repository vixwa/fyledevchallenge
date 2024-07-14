import { Component, OnInit, OnDestroy } from '@angular/core';
import { WorkoutService } from './services/workout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title: 'health-challenge-tracker' = "health-challenge-tracker";
  users: string[] = [];
  selectedUser: string | null = null;
  userWorkouts: any[] = [];
  private userSubscription: Subscription;
  private workoutSubscription: Subscription;

  constructor(private workoutService: WorkoutService) {
    this.userSubscription = new Subscription();
    this.workoutSubscription = new Subscription();
  }

  ngOnInit() {
    this.userSubscription = this.workoutService.users$.subscribe(users => {
      this.users = users;
      if (users.length > 0 && !this.selectedUser) {
        this.selectUserByName(users[0]);
      }
    });

    this.workoutSubscription = this.workoutService.workouts$.subscribe(() => {
      if (this.selectedUser) {
        this.userWorkouts = this.workoutService.getUserWorkouts(this.selectedUser);
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.workoutSubscription) {
      this.workoutSubscription.unsubscribe();
    }
  }

  onSelectUser(event: Event) {
    const select = event.target as HTMLSelectElement;
    if (select) {
      this.selectUserByName(select.value);
    }
  }

  selectUserByName(userName: string) {
    this.selectedUser = userName;
    this.userWorkouts = this.workoutService.getUserWorkouts(userName);
  }

  onWorkoutAdded(newWorkout: any) {
    this.workoutService.addWorkout(newWorkout.name, newWorkout.workout.type, newWorkout.workout.minutes);
  }
}
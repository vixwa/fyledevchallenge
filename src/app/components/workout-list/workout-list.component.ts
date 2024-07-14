import { Component, OnInit, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { WorkoutService } from '../../services/workout.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-workout-list',
  templateUrl: './workout-list.component.html',
  styleUrls: ['./workout-list.component.css']
})
export class WorkoutListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['name', 'workout', 'count', 'minutes', 'actions'];
  dataSource: MatTableDataSource<any>;
  workoutTypes: string[] = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Football'];
  searchText: string = '';
  filterType: string = '';

  @Input() workouts: any[] = [];

  private workoutSubscription: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private workoutService: WorkoutService) {
    this.dataSource = new MatTableDataSource<any>([]);
    this.workoutSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.loadWorkouts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    if (this.workoutSubscription) {
      this.workoutSubscription.unsubscribe();
    }
  }

  loadWorkouts() {
    const fetchedWorkouts = this.workoutService.getWorkouts();
    this.workoutSubscription = this.workoutService.workouts$.subscribe(workouts => {
      const aggregatedWorkouts = this.aggregateWorkouts(workouts);
      this.dataSource.data = aggregatedWorkouts;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    });
  }

  aggregateWorkouts(fetchedWorkouts: any[]): { name: string, workouts: string[], count: number, minutes: number }[] {
    const aggregatedWorkouts = fetchedWorkouts.reduce((acc, curr) => {
      const existingUser = acc.find((w: { name: any; }) => w.name === curr.name);
      if (existingUser) {
        if (!existingUser.workouts.includes(curr.workout.type)) {
          existingUser.workouts.push(curr.workout.type);
        }
        existingUser.count += 1;
        existingUser.minutes += curr.workout.minutes;
      } else {
        acc.push({
          name: curr.name,
          workouts: [curr.workout.type],
          count: 1,
          minutes: curr.workout.minutes
        });
      }
      return acc;
    }, []);
    return aggregatedWorkouts;
  }

  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if (this.filterType && this.filterType !== 'All') {
      this.dataSource.data = this.dataSource.data.filter(workout =>
        workout.workouts.includes(this.filterType)
      );
    } else {
      this.dataSource.data = this.aggregateWorkouts(this.workoutService.getWorkouts());
    }
  }

  addWorkout(newWorkout: any): void {
    const currentData = this.dataSource.data;
    const existingUserIndex = currentData.findIndex(w => w.name === newWorkout.name);

    if (existingUserIndex !== -1) {
      const existingUser = currentData[existingUserIndex];
      if (!existingUser.workouts.includes(newWorkout.workout.type)) {
        existingUser.workouts.push(newWorkout.workout.type);
        existingUser.count++;
      }
      existingUser.minutes += newWorkout.workout.minutes;
    } else {
      currentData.push({
        name: newWorkout.name,
        workouts: [newWorkout.workout.type],
        count: 1,
        minutes: newWorkout.workout.minutes
      });
    }

    this.dataSource.data = currentData;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteWorkout(workout: any) {
    const index = this.dataSource.data.findIndex(w => w.name === workout.name);
    if (index > -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource.data = [...this.dataSource.data];

      const userDataString = localStorage.getItem('userData');
      if (userDataString) {
        try {
          let userData: any[] = JSON.parse(userDataString);
          const userIndex = userData.findIndex(u => u.name === workout.name);
          if (userIndex > -1) {
            userData.splice(userIndex, 1);
            localStorage.setItem('userData', JSON.stringify(userData));
          }
        } catch (error) {
          console.error('Error parsing or updating local storage:', error);
        }
      }
    }
  }
}

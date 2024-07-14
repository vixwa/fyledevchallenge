import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UserInputComponent } from './user-input.component';
import { WorkoutService } from '../../services/workout.service';

describe('UserInputComponent', () => {
  let component: UserInputComponent;
  let fixture: ComponentFixture<UserInputComponent>;
  let workoutService: WorkoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserInputComponent],
      imports: [FormsModule, MatInputModule, MatSelectModule, MatButtonModule, BrowserAnimationsModule],
      providers: [WorkoutService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInputComponent);
    component = fixture.componentInstance;
    workoutService = TestBed.inject(WorkoutService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add workout on form submit', () => {
    component.userName = 'Test User';
    component.workoutType = 'Running';
    component.workoutMinutes = 30;
    component.addWorkout();

    const workouts = workoutService.getWorkouts();
    expect(workouts.some(w => w.name === 'Test User' && w.workout.type === 'Running' && w.workout.minutes === 30)).toBe(true);
  });
});

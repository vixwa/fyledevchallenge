import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';

describe('WorkoutService', () => {
  let service: WorkoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a workout', () => {
    service.addWorkout('Test User', 'Running', 30);
    const workouts = service.getWorkouts();
    expect(workouts.some(w => w.name === 'Test User' && w.workout.type === 'Running' && w.workout.minutes === 30)).toBe(true);
  });

  it('should get initial data', () => {
    const workouts = service.getWorkouts();
    expect(workouts.length).toBeGreaterThan(0);
  });

  it('should retrieve the correct workout', () => {
    service.addWorkout('User A', 'Cycling', 45);
    const workouts = service.getWorkouts();
    const workout = workouts.find(w => w.name === 'User A' && w.workout.type === 'Cycling' && w.workout.minutes === 45);
    expect(workout).toBeDefined();
  });


});

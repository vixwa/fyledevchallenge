import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private storageKey = 'userData';
  private workoutsSubject = new BehaviorSubject<any[]>([]);
  workouts$ = this.workoutsSubject.asObservable();

  private usersSubject = new BehaviorSubject<string[]>([]);
  users$ = this.usersSubject.asObservable();

  private initialData = [
    {
      id: 1,
      name: 'John Doe',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Cycling', minutes: 45 }
      ]
    },
    {
      id: 2,
      name: 'Jane Smith',
      workouts: [
        { type: 'Swimming', minutes: 60 },
        { type: 'Running', minutes: 20 }
      ]
    },
    {
      id: 3,
      name: 'Mike Johnson',
      workouts: [
        { type: 'Yoga', minutes: 50 },
        { type: 'Cycling', minutes: 40 }
      ]
    }
  ];
  
  //clearWorkouts: any;

  constructor() {
    this.initializeData();
    this.loadWorkouts();
    this.updateUsers();
  }

  private initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.initialData));
    }
  }

  private loadWorkouts() {
    const workouts = this.getWorkouts();
    this.workoutsSubject.next(workouts);
  }

  private updateUsers() {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const users = data.map((user: any) => user.name);
    this.usersSubject.next(users);
  }

  addWorkout(name: string, type: string, minutes: number) {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const user = data.find((u: any) => u.name === name);
    const newWorkout = { type, minutes };
    
    if (user) {
      user.workouts.unshift(newWorkout);
    } else {
      data.unshift({ id: Date.now(), name, workouts: [newWorkout] });
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.loadWorkouts();
    this.updateUsers();
  }

  getWorkouts() {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    let workouts: { name: string, workout: { type: string, minutes: number, count: number } }[] = [];
    data.forEach((user: any) => {
      user.workouts.forEach((workout: any, index: number) => {
        workouts.push({ 
          name: user.name, 
          workout: { ...workout, count: user.workouts.length - index }
        });
      });
    });
    return workouts;
  }

  getUserWorkouts(userName: string): any[] {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const user = data.find((u: any) => u.name === userName);
    return user ? user.workouts : [];
  }

  getAllUsers(): string[] {
    const data = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    return data.map((user: any) => user.name);
  }
}
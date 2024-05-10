import { Component } from '@angular/core';
import { WorkoutMiniPreviewComponent } from '../../../shared/workoutViews/workout-mini-preview/workout-mini-preview.component';

@Component({
    selector: 'app-workout',
    standalone: true,
    templateUrl: './workout.component.html',
    styleUrl: './workout.component.css',
    imports: [WorkoutMiniPreviewComponent],
})
export class WorkoutComponent {}

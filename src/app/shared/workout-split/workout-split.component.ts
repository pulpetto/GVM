import { Component } from '@angular/core';
import { WorkoutMiniPreviewComponent } from '../workoutViews/workout-mini-preview/workout-mini-preview.component';

@Component({
    selector: 'app-workout-split',
    standalone: true,
    templateUrl: './workout-split.component.html',
    styleUrl: './workout-split.component.css',
    imports: [WorkoutMiniPreviewComponent],
})
export class WorkoutSplitComponent {}

import { Component } from '@angular/core';
import { WorkoutMiniPreviewComponent } from '../../../shared/workoutViews/workout-mini-preview/workout-mini-preview.component';
import { WorkoutSplitComponent } from '../../../shared/workout-split/workout-split.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-workout',
    standalone: true,
    templateUrl: './workout.component.html',
    styleUrl: './workout.component.css',
    imports: [WorkoutMiniPreviewComponent, WorkoutSplitComponent, RouterModule],
})
export class WorkoutComponent {}

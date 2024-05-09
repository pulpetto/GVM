import { Component } from '@angular/core';
import { WorkoutFullViewComponent } from '../../../../shared/workoutViews/workout-full-view/workout-full-view.component';

@Component({
    selector: 'app-workout-details',
    standalone: true,
    templateUrl: './workout-details.component.html',
    styleUrl: './workout-details.component.css',
    imports: [WorkoutFullViewComponent],
})
export class WorkoutDetailsComponent {}

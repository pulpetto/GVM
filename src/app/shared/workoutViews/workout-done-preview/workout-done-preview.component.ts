import { Component, Input } from '@angular/core';
import { WorkoutDone } from '../../../interfaces/workout/workout-done';
import { TimeFormatterPipe } from '../../../pipes/time-formatter.pipe';

@Component({
    selector: 'app-workout-done-preview',
    standalone: true,
    imports: [TimeFormatterPipe],
    templateUrl: './workout-done-preview.component.html',
    styleUrl: './workout-done-preview.component.css',
})
export class WorkoutDonePreviewComponent {
    @Input({ required: true }) workoutData!: WorkoutDone;
}

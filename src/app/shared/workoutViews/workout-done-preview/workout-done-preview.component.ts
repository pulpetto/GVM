import { Component, Input } from '@angular/core';
import { Exercise } from '../../../interfaces/exercise';

@Component({
    selector: 'app-workout-done-preview',
    standalone: true,
    imports: [],
    templateUrl: './workout-done-preview.component.html',
    styleUrl: './workout-done-preview.component.css',
})
export class WorkoutDonePreviewComponent {
    @Input() name!: string;
    @Input() dateUnix!: number;
    @Input() durationUnix!: number;
    @Input() weightLifted!: number;
    @Input() exercises!: Exercise[];
    totalSetsAmount!: number;
}

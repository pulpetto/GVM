import { Component, Input } from '@angular/core';
import { Exercise } from '../../interfaces/exercise';

@Component({
    selector: 'app-workout-preview',
    standalone: true,
    imports: [],
    templateUrl: './workout-preview.component.html',
    styleUrl: './workout-preview.component.css',
})
export class WorkoutPreviewComponent {
    @Input() name!: string;
    @Input() dateUnix!: number;
    @Input() durationUnix!: number;
    @Input() weightLifted!: number;
    @Input() exercises!: Exercise[];
    totalSetsAmount!: number;
}

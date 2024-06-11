import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Set } from '../../interfaces/set';

@Component({
    selector: 'app-exercise-edit-mode',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './exercise-edit-mode.component.html',
    styleUrl: './exercise-edit-mode.component.css',
})
export class ExerciseEditModeComponent {
    optionsModalVisibility: boolean = false;

    sets: Set[] = [
        { number: 1, type: 'normal', weight: 100, reps: 20, rpe: 9, rir: 1 },
        { number: 2, type: 'normal', weight: 100, reps: 20, rpe: 9, rir: 1 },
        { number: 3, type: 'normal', weight: 100, reps: 20, rpe: 9, rir: 1 },
        { number: 4, type: 'normal', weight: 100, reps: 20, rpe: 9, rir: 1 },
    ];
}

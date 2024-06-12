import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Set } from '../../interfaces/set';
import { InfoModalButtonComponent } from '../info-modal-button/info-modal-button.component';

@Component({
    selector: 'app-exercise-edit-mode',
    standalone: true,
    templateUrl: './exercise-edit-mode.component.html',
    styleUrl: './exercise-edit-mode.component.css',
    imports: [CommonModule, InfoModalButtonComponent],
})
export class ExerciseEditModeComponent {
    optionsModalVisibility: boolean = false;

    sets: Set[] = [
        { number: 1, type: 'W', weight: 100, reps: 20, rpe: 9 },
        { number: 2, type: 'W', weight: 100, reps: 20, rpe: 9 },
        { number: 3, type: 'W', weight: 100, reps: 20, rpe: 9 },
        { number: 4, type: 'W', weight: 100, reps: 20, rpe: 9 },
    ];
}

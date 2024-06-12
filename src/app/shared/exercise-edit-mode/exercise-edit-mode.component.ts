import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoModalButtonComponent } from '../info-modal-button/info-modal-button.component';
import { SetComponent } from './set/set.component';

@Component({
    selector: 'app-exercise-edit-mode',
    standalone: true,
    templateUrl: './exercise-edit-mode.component.html',
    styleUrl: './exercise-edit-mode.component.css',
    imports: [CommonModule, InfoModalButtonComponent, SetComponent],
})
export class ExerciseEditModeComponent {
    optionsModalVisibility: boolean = false;

    sets = [
        {
            number: 1,
            weight: 100,
            reps: 20,
            rpe: 9,
        },
        { number: 2, weight: 100, reps: 20, rpe: 9 },
        { number: 3, weight: 100, reps: 20, rpe: 9 },
        { number: 4, weight: 100, reps: 20, rpe: 9 },
    ];
}

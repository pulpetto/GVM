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
        },
    ];

    addSet() {
        this.sets.push({
            number: this.sets.length + 1,
        });
    }
}

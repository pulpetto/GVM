import { Component, EventEmitter, Input, Output } from '@angular/core';
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
    @Output() exercisesRemoveEvent = new EventEmitter<string>();

    @Input({ required: true }) exerciseName!: string;
    @Input({ required: true }) exerciseImgUrl!: string;

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

    exerciseRemove() {
        this.exercisesRemoveEvent.emit(this.exerciseName);
        this.closeOptionsModal();
    }

    closeOptionsModal() {
        this.optionsModalVisibility = false;
    }
}

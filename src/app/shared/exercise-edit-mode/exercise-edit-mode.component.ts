import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoModalButtonComponent } from '../info-modal-button/info-modal-button.component';
import { SetComponent } from './set/set.component';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-exercise-edit-mode',
    standalone: true,
    templateUrl: './exercise-edit-mode.component.html',
    styleUrl: './exercise-edit-mode.component.css',
    imports: [
        CommonModule,
        InfoModalButtonComponent,
        SetComponent,
        RouterModule,
    ],
})
export class ExerciseEditModeComponent {
    @Output() exercisesRemoveEvent = new EventEmitter<number>();

    @Input({ required: true }) exerciseName!: string;
    @Input({ required: true }) exerciseImgUrl!: string;
    @Input({ required: true }) index!: number;

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
        this.exercisesRemoveEvent.emit(this.index);
        this.closeOptionsModal();
    }

    closeOptionsModal() {
        this.optionsModalVisibility = false;
    }
}

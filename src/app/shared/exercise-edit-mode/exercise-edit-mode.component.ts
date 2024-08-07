import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoModalButtonComponent } from '../info-modal-button/info-modal-button.component';
import { SetComponent } from './set/set.component';
import { RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

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
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style(hiddenModal),
                animate(timing, style(visibleModal)),
            ]),
            transition(':leave', [
                style(visibleModal),
                animate(timing, style(hiddenModal)),
            ]),
        ]),
        trigger('openClose2', [
            transition(':enter', [
                style(hiddenBg),
                animate(timing, style(visibleBg)),
            ]),
            transition(':leave', [
                style(visibleBg),
                animate(timing, style(hiddenBg)),
            ]),
        ]),
    ],
})
export class ExerciseEditModeComponent {
    fb = inject(FormBuilder);

    @Output() exercisesRemoveEvent = new EventEmitter<number>();

    @Input({ required: true }) exercise!: FormGroup;
    @Input({ required: true }) exerciseIndex!: number;
    @Input({ required: true }) exerciseName!: string;
    @Input({ required: true }) exerciseImgUrl!: string;

    optionsModalVisibility: boolean = false;

    get sets(): FormArray<FormGroup> {
        return this.exercise.get('sets') as FormArray<FormGroup>;
    }

    addSet() {
        const set = this.fb.group({
            setNumber: [this.sets.length + 1],
        });

        this.sets.push(set);
    }

    exerciseRemove() {
        this.exercisesRemoveEvent.emit(this.exerciseIndex);
        this.closeOptionsModal();
    }

    closeOptionsModal() {
        this.optionsModalVisibility = false;
    }
}

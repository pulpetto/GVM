import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoModalButtonComponent } from '../info-modal-button/info-modal-button.component';
import { SetComponent } from './set/set.component';
import { RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { TimeFormatterPipe } from '../../pipes/time-formatter.pipe';

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

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
        TimeFormatterPipe,
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
        trigger('openClose3', [
            transition(':enter', [
                style(hiddenBtnFixed),
                animate(timing, style(visibleBtnFixed)),
            ]),
            transition(':leave', [
                style(visibleBtnFixed),
                animate(timing, style(hiddenBtnFixed)),
            ]),
        ]),
    ],
})
export class ExerciseEditModeComponent {
    fb = inject(FormBuilder);

    @Output() exercisesRemoveEvent = new EventEmitter<number[]>();
    @Output() exercisesReorderEvent = new EventEmitter<void>();
    @Output() addSupersetEvent = new EventEmitter<(string | number)[]>();
    @Output() removeSupersetEvent = new EventEmitter<(string | number)[]>();

    @Input({ required: true }) exercise!: FormGroup;
    @Input({ required: true }) workoutComputedValues!: FormGroup<{
        volume: FormControl<number | null>;
        setsDone: FormControl<number | null>;
    }>;
    @Input({ required: true }) exerciseId!: number;
    @Input({ required: true }) exerciseIndex!: number;
    @Input({ required: true }) exerciseName!: string;
    @Input({ required: true }) exerciseImgUrl!: string;
    @Input({ required: true }) exercisesAmount!: number;
    @Input({ required: true }) editView!:
        | 'new'
        | 'existing'
        | 'current'
        | 'done';

    optionsModalVisibility: boolean = false;
    restTimeConfigModalVisibility: boolean = false;

    get supersetColor(): string | null {
        return this.exercise.get('superSetColor')?.value;
    }

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
        this.exercisesRemoveEvent.emit([this.exerciseId, this.exerciseIndex]);
        this.closeOptionsModal();
    }

    closeOptionsModal() {
        this.optionsModalVisibility = false;
    }

    reorderExercise() {
        this.exercisesReorderEvent.emit();
        this.optionsModalVisibility = false;
    }

    addSuperset() {
        this.optionsModalVisibility = false;
        this.addSupersetEvent.emit([this.exerciseName, this.exerciseIndex]);
    }

    removeSuperset() {
        this.optionsModalVisibility = false;
        this.removeSupersetEvent.emit([
            this.supersetColor!,
            this.exerciseIndex,
        ]);
    }
}

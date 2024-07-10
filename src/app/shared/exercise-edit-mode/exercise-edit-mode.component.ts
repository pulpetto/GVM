import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoModalButtonComponent } from '../info-modal-button/info-modal-button.component';
import { SetComponent } from './set/set.component';
import { RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

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
export class ExerciseEditModeComponent implements OnInit {
    fb = inject(FormBuilder);

    @Output() exercisesRemoveEvent = new EventEmitter<number>();

    @Input({ required: true }) exercise!: FormGroup;
    @Input({ required: true }) exerciseIndex!: number;
    @Input({ required: true }) exerciseName!: string;
    @Input({ required: true }) exerciseImgUrl!: string;

    optionsModalVisibility: boolean = false;

    ngOnInit() {
        const set = this.fb.group({
            setNumber: [1],
        });

        this.sets.push(set);
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
        this.exercisesRemoveEvent.emit(this.exerciseIndex);
        this.closeOptionsModal();
    }

    closeOptionsModal() {
        this.optionsModalVisibility = false;
    }
}

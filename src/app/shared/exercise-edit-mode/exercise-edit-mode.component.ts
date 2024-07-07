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
    @Output() exercisesRemoveEvent = new EventEmitter<number>();

    @Input({ required: true }) exerciseName!: string;
    @Input({ required: true }) exerciseImgUrl!: string;
    @Input({ required: true }) index!: number;
    @Input({ required: true }) exerciseFormGroup!: FormGroup;

    fb = inject(FormBuilder);

    optionsModalVisibility: boolean = false;

    exerciseForm = this.fb.group({
        sets: this.fb.array([]),
    });

    ngOnInit() {
        const setGroup = this.fb.group({
            setNumber: [1],
        });

        this.sets.push(setGroup);
    }

    get sets(): FormArray<FormGroup> {
        return this.exerciseFormGroup.get('sets') as FormArray<FormGroup>;
    }

    addSet() {
        const setGroup = this.fb.group({
            setNumber: [this.sets.length + 1],
        });

        this.sets.push(setGroup);
    }

    exerciseRemove() {
        this.exercisesRemoveEvent.emit(this.index);
        this.closeOptionsModal();
    }

    closeOptionsModal() {
        this.optionsModalVisibility = false;
    }
}

import { Component, DestroyRef, inject } from '@angular/core';
import { ExerciseEditModeComponent } from '../../../../shared/exercise-edit-mode/exercise-edit-mode.component';
import { NameEditorComponent } from './name-editor/name-editor.component';
import { ExercisesSelectorComponent } from './exercises-selector/exercises-selector.component';
import { DataService } from '../../../../services/data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-creator',
    standalone: true,
    templateUrl: './creator.component.html',
    styleUrl: './creator.component.css',
    imports: [
        ExerciseEditModeComponent,
        NameEditorComponent,
        ExercisesSelectorComponent,
        CommonModule,
    ],
})
export class CreatorComponent {
    fb = inject(FormBuilder);
    dataService = inject(DataService);
    destroyRef = inject(DestroyRef);

    workoutForm = this.fb.group({
        exercises: this.fb.array([]),
    });

    get workoutExercises(): FormArray {
        return this.workoutForm.get('exercises') as FormArray;
    }

    addExercises(selectedExercisesIds: Set<number>) {
        selectedExercisesIds.forEach((selectedExerciseId: number) => {
            this.dataService
                .getExerciseById(selectedExerciseId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((exercise) => {
                    if (exercise) {
                        const exerciseGroup = this.fb.group({
                            exerciseObj: [exercise],
                            sets: this.fb.array([]),
                        });

                        console.log(exerciseGroup);

                        this.workoutExercises.push(exerciseGroup);
                    }
                });
        });
    }

    removeExercise(index: number) {
        this.workoutExercises.removeAt(index);
    }
}

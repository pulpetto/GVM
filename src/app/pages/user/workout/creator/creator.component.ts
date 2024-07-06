import { Component, DestroyRef, inject } from '@angular/core';
import { ExerciseEditModeComponent } from '../../../../shared/exercise-edit-mode/exercise-edit-mode.component';
import { NameEditorComponent } from './name-editor/name-editor.component';
import { ExercisesSelectorComponent } from './exercises-selector/exercises-selector.component';
import { DataService } from '../../../../services/data.service';
import { Exercise } from '../../../../interfaces/exercise';
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

    exercises: Exercise[] = [];

    workoutForm = this.fb.group({
        exercises: this.fb.array([]),
    });

    get workoutExercises(): FormArray {
        return this.workoutForm.get('exercises') as FormArray;
    }

    addExercises(selectedExercisesIds: Set<number>) {
        selectedExercisesIds.forEach((selectedExerciseId: number) => {
            const exerciseGroup = this.fb.group({
                exerciseId: [selectedExerciseId],
                sets: this.fb.array([]),
            });

            this.workoutExercises.push(exerciseGroup);

            this.dataService
                .getExerciseById(selectedExerciseId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((exercise) => {
                    if (exercise) this.exercises.push(exercise);
                });
        });
    }

    removeExercise(exerciseName: string) {
        const indexToRemove = this.exercises.findIndex(
            (exercise) => exercise.name === exerciseName
        );

        this.workoutExercises.removeAt(indexToRemove);
        this.exercises.splice(indexToRemove, 1);
    }

    supersetModalVisibility: boolean = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exercisesForSuperset: any[] = [];
    exerciseToSupersetIndex!: number;

    addToSuperset(exerciseName: string) {
        this.supersetModalVisibility = true;

        const exerciseIndex = this.exercises.findIndex(
            (exercise) => exercise.name === exerciseName
        );

        this.exerciseToSupersetIndex = exerciseIndex;

        this.exercisesForSuperset = [
            ...this.exercises.slice(0, exerciseIndex),
            ...this.exercises.slice(exerciseIndex + 1),
        ];

        this.exercisesForSuperset.forEach((exercise) => {
            exercise.isPaired = false;
        });
    }

    canSubmitSuperset: boolean = false;

    onSupersetExerciseSelect($index: number) {
        if (!this.exercisesForSuperset[$index].isPaired) {
            this.exercisesForSuperset.forEach(
                (exercise) => (exercise.isPaired = false)
            );

            this.exercisesForSuperset[$index].isPaired = true;

            this.canSubmitSuperset = true;
        } else {
            this.exercisesForSuperset.forEach(
                (exercise) => (exercise.isPaired = false)
            );

            this.canSubmitSuperset = false;
        }
    }

    onSupersetExercisesPair() {}
}

import { Component, DestroyRef, inject } from '@angular/core';
import { ExerciseEditModeComponent } from '../../../../shared/exercise-edit-mode/exercise-edit-mode.component';
import { NameEditorComponent } from './name-editor/name-editor.component';
import { ExercisesSelectorComponent } from './exercises-selector/exercises-selector.component';
import { DataService } from '../../../../services/data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../../../shared/loading-spinner/loading-spinner.component';
import { ReactiveFormsModule } from '@angular/forms';

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
        LoadingSpinnerComponent,
        ReactiveFormsModule,
    ],
})
export class CreatorComponent {
    fb = inject(FormBuilder);
    dataService = inject(DataService);
    destroyRef = inject(DestroyRef);

    loading: boolean = false;

    workoutForm = this.fb.group({
        name: 'My Workout 1',
        exercises: this.fb.array([]),
    });

    exercisesPresentionalData: {
        id: number;
        name: string;
        imageUrl: string;
    }[] = [];

    get workoutExercises(): FormArray<FormGroup> {
        return this.workoutForm.get('exercises') as FormArray<FormGroup>;
    }

    addExercises(selectedExercisesIds: Set<number>) {
        this.loading = true;

        selectedExercisesIds.forEach((selectedExerciseId: number) => {
            this.dataService
                .getExerciseById(selectedExerciseId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((exercise) => {
                    if (exercise) {
                        this.exercisesPresentionalData.push({
                            id: exercise.id,
                            name: exercise.name,
                            imageUrl: exercise.imageUrl,
                        });

                        const exerciseGroup = this.fb.group({
                            exerciseId: exercise.id,
                            sets: this.fb.array([]),
                        });

                        this.workoutExercises.push(exerciseGroup);

                        this.loading = false;
                    }
                });
        });
    }

    removeExercise(index: number) {
        this.exercisesPresentionalData.splice(index, 1);
        this.workoutExercises.removeAt(index);
    }

    updateWorkoutName($event: string) {
        this.workoutForm.get('name')?.setValue($event);
    }
}

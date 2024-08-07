import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ExerciseEditModeComponent } from '../../exercise-edit-mode/exercise-edit-mode.component';
import { NameEditorComponent } from './name-editor/name-editor.component';
import { ExercisesSelectorComponent } from './exercises-selector/exercises-selector.component';
import { DataService } from '../../../services/data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Workout } from '../../../interfaces/workout/workout';
import { ActivatedRoute } from '@angular/router';
import { WorkoutExercise } from '../../../interfaces/workout/workout-exercise';

@Component({
    selector: 'app-workout-template-editor',
    standalone: true,
    templateUrl: './workout-template-editor.component.html',
    styleUrl: './workout-template-editor.component.css',
    imports: [
        ExerciseEditModeComponent,
        NameEditorComponent,
        ExercisesSelectorComponent,
        CommonModule,
        LoadingSpinnerComponent,
        ReactiveFormsModule,
    ],
})
export class WorkoutTemplateEditorComponent implements OnInit {
    fb = inject(FormBuilder);
    userService = inject(UserService);
    dataService = inject(DataService);
    destroyRef = inject(DestroyRef);
    route = inject(ActivatedRoute);

    loading: boolean = false;

    isNew!: string;

    workoutForm = this.fb.group({
        name: 'My Workout 1',
        exercises: this.fb.array([]),
    });

    exercisesPresentionalData: {
        id: number;
        name: string;
        imageUrl: string;
    }[] = [];

    get workoutName(): FormControl<string> {
        return this.workoutForm.get('name') as FormControl<string>;
    }

    get workoutExercises(): FormArray<FormGroup> {
        return this.workoutForm.get('exercises') as FormArray<FormGroup>;
    }

    ngOnInit() {
        this.userService.user$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((user) => {
                if (user) {
                    this.route.queryParams
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe((queryParams) => {
                            this.isNew = queryParams['isNew'];

                            if (this.isNew === 'false') {
                                this.route.paramMap
                                    .pipe(takeUntilDestroyed(this.destroyRef))
                                    .subscribe((params) => {
                                        const workoutId =
                                            params.get('workoutId')!;

                                        this.userService
                                            .getWorkoutById(workoutId)
                                            .subscribe((data) => {
                                                if (data) {
                                                    this.workoutForm
                                                        .get('name')!
                                                        .setValue(data.name);
                                                }
                                            });
                                    });
                            }
                        });
                }
            });
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

                        const sets = exerciseGroup.get('sets') as FormArray;

                        const set = this.fb.group({
                            setNumber: 1,
                        });

                        sets.push(set);

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

    saveWorkout() {
        this.userService.saveWorkout(this.workoutForm.getRawValue() as Workout);
    }
}

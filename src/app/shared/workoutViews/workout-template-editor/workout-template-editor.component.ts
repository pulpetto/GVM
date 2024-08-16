import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ExerciseEditModeComponent } from '../../exercise-edit-mode/exercise-edit-mode.component';
import { NameEditorComponent } from './name-editor/name-editor.component';
import { ExercisesSelectorComponent } from './exercises-selector/exercises-selector.component';
import { DataService } from '../../../services/data.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { Workout } from '../../../interfaces/workout/workout';
import { ActivatedRoute } from '@angular/router';
import { WorkoutExercise } from '../../../interfaces/workout/workout-exercise';
import { DropSet } from '../../../interfaces/set-types/drop-set';
import { ClusterSet } from '../../../interfaces/set-types/cluster-set';
import { EMPTY, filter, switchMap } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import {
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    CdkDragDrop,
    moveItemInArray,
} from '@angular/cdk/drag-drop';
import { TimeFormatterPipe } from '../../../pipes/time-formatter.pipe';

const visibleModal = { top: '0%' };
const visibleModalTop50 = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

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
        CdkDropListGroup,
        CdkDropList,
        CdkDrag,
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
        trigger('openClose4', [
            transition(':enter', [
                style(hiddenModal),
                animate(timing, style(visibleModalTop50)),
            ]),
            transition(':leave', [
                style(visibleModalTop50),
                animate(timing, style(hiddenModal)),
            ]),
        ]),
    ],
})
export class WorkoutTemplateEditorComponent implements OnInit {
    fb = inject(FormBuilder);
    userService = inject(UserService);
    dataService = inject(DataService);
    destroyRef = inject(DestroyRef);
    route = inject(ActivatedRoute);
    location = inject(Location);

    loading: boolean = false;
    editView!: 'new' | 'existing' | 'current' | 'done';
    isNew!: string;
    workoutId!: string;
    exercisesPresentionalData: {
        id: number;
        name: string;
        imageUrl: string;
    }[] = [];
    selectedExercisesIds = new Set<number>();
    exercisesReorderModalVisibility: boolean = false;
    workoutForm = this.fb.group({
        name: 'My Workout 1',
        exercises: this.fb.array([]),
    });

    workoutComputedValues: FormGroup<{
        volume: FormControl<number | null>;
        setsDone: FormControl<number | null>;
    }> = this.fb.group({
        volume: 0,
        setsDone: 0,
    });

    workoutDurationModalVisibility: boolean = false;

    supersetModalVisibility: boolean = false;
    supersetColorPickerModalVisibility: boolean = false;
    supersetedExerciseName!: string;
    supersetedExerciseIndex!: number;
    secondSupersetedExerciseIndex!: number;
    colors: string[] = [
        'bg-red-500',
        'bg-orange-500',
        // 'bg-amber-500',
        'bg-yellow-500',
        // 'bg-lime-500',
        'bg-green-500',
        // 'bg-teal-500',
        // 'bg-cyan-500',
        'bg-sky-500',
        'bg-blue-500',
        // 'bg-indigo-500',
        'bg-violet-500',
        // 'bg-purple-500',
        'bg-fuchsia-500',
        // 'bg-pink-500',
        // 'bg-rose-500',
    ];

    initalizeSupersetModal($event: (string | number)[]) {
        this.supersetedExerciseName = $event[0].toString();
        this.supersetedExerciseIndex = +$event[1];
        this.supersetModalVisibility = true;
    }

    getSupersetColor(index: number) {
        const selectedExerciseObj = this.workoutForm.controls.exercises.at(
            index
        ).value as WorkoutExercise;

        return selectedExerciseObj.superSetColor;
    }

    addToSuperset(selectedExerciseIndex: number) {
        this.secondSupersetedExerciseIndex = selectedExerciseIndex;

        const selectedExerciseObj = this.workoutForm.controls.exercises.at(
            selectedExerciseIndex
        ).value as WorkoutExercise;

        if (selectedExerciseObj.superSetColor) {
            this.workoutForm.controls.exercises
                .at(this.supersetedExerciseIndex)
                .get('superSetColor')
                ?.setValue(selectedExerciseObj.superSetColor);

            this.supersetModalVisibility = false;
        } else {
            this.supersetColorPickerModalVisibility = true;
        }
    }

    addNewSuperset(color: string) {
        this.workoutForm.controls.exercises
            .at(this.supersetedExerciseIndex)
            .get('superSetColor')
            ?.setValue(color);

        this.workoutForm.controls.exercises
            .at(this.secondSupersetedExerciseIndex)
            .get('superSetColor')
            ?.setValue(color);

        this.supersetModalVisibility = false;
        this.supersetColorPickerModalVisibility = false;

        this.colors = this.colors.filter((col) => col !== color);
    }

    removeFromSuperset($event: (string | number)[]) {
        const indexesArray: number[] = [];

        this.workoutExercises.controls.forEach((exercise, i) => {
            if (exercise.get('superSetColor')?.value === $event[0]) {
                indexesArray.push(i);
            }
        });

        if (indexesArray.length > 2) {
            this.workoutForm.controls.exercises
                .at(+$event[1])
                .get('superSetColor')
                ?.setValue(null);
        } else {
            this.colors.push(
                this.workoutForm.controls.exercises.at(0).get('superSetColor')
                    ?.value
            );

            indexesArray.forEach((i) => {
                this.workoutForm.controls.exercises
                    .at(i)
                    .get('superSetColor')
                    ?.setValue(null);
            });
        }
    }

    get workoutName(): FormControl<string> {
        return this.workoutForm.get('name') as FormControl<string>;
    }

    get workoutExercises(): FormArray<FormGroup> {
        return this.workoutForm.get('exercises') as FormArray<FormGroup>;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    workoutDurationInterval!: any;
    workoutDuration: number = 0;
    totalSets: number = 0;

    ngOnInit() {
        this.userService.user$
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                filter((user) => !!user),
                switchMap(() => this.route.queryParams),
                switchMap((queryParams) => {
                    this.editView = queryParams['editView'];
                    if (this.editView === 'existing') {
                        return this.route.paramMap.pipe(
                            switchMap((params) => {
                                this.workoutId = params.get('workoutId')!;
                                return this.userService.getWorkoutById(
                                    this.workoutId
                                );
                            })
                        );
                    } else if (this.editView === 'current') {
                        this.workoutDurationInterval = setInterval(() => {
                            this.workoutDuration++;
                        }, 1000);

                        return this.route.paramMap.pipe(
                            switchMap((params) => {
                                this.workoutId = params.get('workoutId')!;
                                return this.userService.getWorkoutById(
                                    this.workoutId
                                );
                            })
                        );
                    } else {
                        return EMPTY;
                    }
                })
            )
            .subscribe((data) => {
                if (data) {
                    this.workoutForm.get('name')!.setValue(data.name);
                    this.addInitialExercises(data.exercises);
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
                            superSetColor: null,
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

    addInitialExercises(initialExercises: WorkoutExercise[]) {
        this.loading = true;

        initialExercises.forEach((initialExercise) => {
            this.dataService
                .getExerciseById(initialExercise.exerciseId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((exercise) => {
                    if (exercise) {
                        this.selectedExercisesIds.add(exercise.id);

                        this.exercisesPresentionalData.push({
                            id: exercise.id,
                            name: exercise.name,
                            imageUrl: exercise.imageUrl,
                        });

                        const exerciseGroup = this.fb.group({
                            exerciseId: exercise.id,
                            superSetColor: initialExercise.superSetColor,
                            sets: this.fb.array([]),
                        });

                        initialExercise.sets.forEach((set) => {
                            if (
                                this.editView === 'current' ||
                                this.editView === 'new'
                            )
                                this.totalSets++;

                            const setsFormArray = exerciseGroup.get(
                                'sets'
                            ) as FormArray;

                            const setFormGroup = this.fb.group({});

                            setFormGroup.addControl(
                                'setNumber',
                                this.fb.control(set.setNumber)
                            );
                            setFormGroup.addControl(
                                'setTypeName',
                                this.fb.control(set.setTypeName)
                            );
                            setFormGroup.addControl(
                                'weight',
                                this.fb.control(set.weight)
                            );
                            setFormGroup.addControl(
                                'reps',
                                this.fb.control(set.reps)
                            );
                            setFormGroup.addControl(
                                'rpe',
                                this.fb.control(set.rpe)
                            );

                            if (set.dropsets) {
                                setFormGroup.addControl(
                                    'dropsets',
                                    this.fb.array<DropSet[]>([])
                                );

                                set.dropsets.forEach((dropset) => {
                                    const dropsetObj = this.fb.group({
                                        weight: dropset.weight,
                                        reps: dropset.reps,
                                        rpe: dropset.rpe,
                                    });

                                    const dropsetsFormArray = setFormGroup.get(
                                        'dropsets'
                                    ) as unknown as FormArray;

                                    dropsetsFormArray.push(dropsetObj);
                                });
                            }

                            if (set.clustersets) {
                                setFormGroup.addControl(
                                    'clustersets',
                                    this.fb.array<ClusterSet[]>([])
                                );

                                set.clustersets.forEach((clusterset) => {
                                    const clustersetObj = this.fb.group({
                                        restTime: clusterset.restTime,
                                        reps: clusterset.reps,
                                        rpe: clusterset.rpe,
                                    });

                                    const clustersetsFormArray =
                                        setFormGroup.get(
                                            'clustersets'
                                        ) as unknown as FormArray;

                                    clustersetsFormArray.push(clustersetObj);
                                });
                            }

                            if (set.tempo) {
                                setFormGroup.addControl(
                                    'tempo',
                                    this.fb.group(set.tempo)
                                );
                            }

                            setsFormArray.push(setFormGroup);
                        });

                        this.workoutExercises.push(exerciseGroup);
                    }
                });
        });

        this.loading = false;
    }

    removeExercise($event: number[]) {
        this.selectedExercisesIds.delete($event[0]);
        this.exercisesPresentionalData.splice($event[1], 1);
        this.workoutExercises.removeAt($event[1]);
    }

    saveWorkout() {
        if (this.editView === 'new') {
            this.userService.saveWorkout(
                this.workoutForm.getRawValue() as Workout
            );
        }

        if (this.editView === 'existing') {
            this.userService.updateWorkout(
                this.workoutId,
                this.workoutForm.getRawValue() as Workout
            );
        }
    }

    cancelEdit() {
        this.location.back();
    }

    changeExercisesOrder(
        event: CdkDragDrop<
            {
                id: number;
                name: string;
                imageUrl: string;
            }[]
        >
    ) {
        moveItemInArray(
            event.container.data,
            event.previousIndex,
            event.currentIndex
        );

        const from = this.workoutExercises.at(event.previousIndex);

        this.workoutExercises.removeAt(event.previousIndex);

        this.workoutExercises.insert(event.currentIndex, from);
    }
}

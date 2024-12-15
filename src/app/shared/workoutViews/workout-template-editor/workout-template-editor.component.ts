import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
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
import { ActivatedRoute, RouterModule } from '@angular/router';
import { WorkoutExercise } from '../../../interfaces/workout/workout-exercise';
import { DropSet } from '../../../interfaces/set-types/drop-set';
import { ClusterSet } from '../../../interfaces/set-types/cluster-set';
import { EMPTY, filter, Observable, switchMap } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';
import {
    CdkDropList,
    CdkDrag,
    CdkDragDrop,
    moveItemInArray,
} from '@angular/cdk/drag-drop';
import { TimeFormatterPipe } from '../../../pipes/time-formatter.pipe';
import { WorkoutDone } from '../../../interfaces/workout/workout-done';
import { ExercisePreview } from '../../../interfaces/exercise-preview';
import { TimingModalComponent } from './timing-modal/timing-modal.component';
import { DurationModalComponent } from './duration-modal/duration-modal.component';
import { StartDateModalComponent } from './start-date-modal/start-date-modal.component';
import { NavbarVisibilityService } from '../../../services/navbar-visibility.service';
import { ActivityBarComponent } from '../../activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../previous-route-button/previous-route-button.component';
import { WorkoutDoneFull } from '../../../interfaces/workout/workout-done-full';
import { WorkoutTemplate } from '../../../interfaces/workout-template';

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
        CdkDropList,
        CdkDrag,
        TimeFormatterPipe,
        TimingModalComponent,
        DurationModalComponent,
        StartDateModalComponent,
        ActivityBarComponent,
        PreviousRouteButtonComponent,
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
export class WorkoutTemplateEditorComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    fb = inject(FormBuilder);
    userService = inject(UserService);
    dataService = inject(DataService);
    destroyRef = inject(DestroyRef);
    route = inject(ActivatedRoute);
    navbarVisibilityService = inject(NavbarVisibilityService);
    cdr = inject(ChangeDetectorRef);

    loading: boolean = false;
    editView!: 'new' | 'existing' | 'current' | 'done';
    isNew!: string;
    workoutId!: string;
    exercisesPresentionalData: ExercisePreview[] = [];
    selectedExercisesIds = new Set<string>();
    exercisesReorderModalVisibility: boolean = false;
    workoutTemplateId: string | null = null;
    workoutForm = this.fb.group({
        name: 'My Workout 1',
        exercises: this.fb.array([]),
        dateStart: this.fb.group({
            year: '',
            month: '',
            day: '',
            hour: '',
            minute: '',
        }),
        duration: '',
    });

    get activityBarTitle(): string {
        let nameToReturn: string;

        if (this.editView === 'new') {
            nameToReturn = 'Workout creator';
        }

        if (this.editView === 'existing') {
            nameToReturn = 'Workout template editor';
        }

        if (this.editView === 'current') {
            nameToReturn = 'Current workout';
        }

        if (this.editView === 'done') {
            nameToReturn = 'Done workout editor';
        }

        return nameToReturn!;
    }

    get workoutDateStartValue(): {
        year: string | null;
        month: string | null;
        day: string | null;
        hour: string | null;
        minute: string | null;
    } {
        return this.workoutForm.get('dateStart')?.value as {
            year: string | null;
            month: string | null;
            day: string | null;
            hour: string | null;
            minute: string | null;
        };
    }

    get workoutDateStart(): FormGroup {
        return this.workoutForm.get('dateStart') as FormGroup;
    }

    get workoutDurationFormControl(): FormControl {
        return this.workoutForm.get('duration') as FormControl;
    }

    workoutComputedValues: FormGroup<{
        volume: FormControl<number | null>;
        setsDone: FormControl<number | null>;
    }> = this.fb.group({
        volume: 0,
        setsDone: 0,
    });

    workoutTimingModalVisibility: boolean = false;
    workoutDurationModalVisibility: boolean = false;
    workoutStartDateModalVisibility: boolean = false;

    supersetModalVisibility: boolean = false;
    supersetColorPickerModalVisibility: boolean = false;
    supersetedExerciseName!: string;
    supersetedExerciseIndex!: number;
    secondSupersetedExerciseIndex!: number;
    colors: string[] = [
        'bg-red-500',
        'bg-orange-500',
        'bg-amber-500',
        'bg-yellow-500',
        'bg-lime-500',
        'bg-green-500',
        'bg-teal-500',
        'bg-cyan-500',
        'bg-sky-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-violet-500',
        'bg-purple-500',
        'bg-fuchsia-500',
        'bg-pink-500',
        'bg-rose-500',
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
                                return this.userService.getWorkoutTemplateById(
                                    this.workoutId
                                ) as Observable<WorkoutDone>;
                            })
                        );
                    } else if (this.editView === 'current') {
                        const dateStartUnix = Math.floor(Date.now() / 1000);

                        const date = new Date(dateStartUnix * 1000);

                        this.workoutForm.controls.dateStart.controls.year.setValue(
                            date.getFullYear() + ''
                        );

                        this.workoutForm.controls.dateStart.controls.month.setValue(
                            date.getMonth() + 1 + ''
                        );

                        this.workoutForm.controls.dateStart.controls.day.setValue(
                            date.getDate() + ''
                        );

                        this.workoutForm.controls.dateStart.controls.hour.setValue(
                            date.getHours() + ''
                        );

                        this.workoutForm.controls.dateStart.controls.minute.setValue(
                            date.getMinutes() + ''
                        );

                        this.workoutDurationInterval = setInterval(() => {
                            this.workoutDuration++;
                        }, 1000);

                        return this.route.paramMap.pipe(
                            switchMap((params) => {
                                this.workoutId = params.get('workoutId')!;
                                return this.userService.getWorkoutTemplateById(
                                    this.workoutId
                                ) as Observable<WorkoutDone>;
                            })
                        );
                    } else if (this.editView === 'done') {
                        return this.route.paramMap.pipe(
                            switchMap((params) => {
                                this.workoutId = params.get('workoutId')!;
                                return this.userService.getDoneWorkoutById(
                                    this.workoutId
                                ) as Observable<WorkoutDone>;
                            })
                        );
                    } else {
                        return EMPTY;
                    }
                })
            )
            .subscribe((data) => {
                if (data) {
                    if (this.editView === 'done') {
                        const workout = data as unknown as WorkoutDoneFull;
                        this.workoutTemplateId = workout.workoutTemplateId;
                    } else {
                        this.workoutTemplateId = null;
                    }

                    this.workoutForm.get('name')!.setValue(data.name);
                    this.addInitialExercises(data.exercises);

                    if (this.editView === 'done') {
                        this.workoutDuration = data.duration;

                        const dateStartUnix = Math.floor(data.dateStart);

                        const date = new Date(dateStartUnix * 1000);

                        this.workoutForm.controls.dateStart.controls.year.setValue(
                            date.getFullYear() + ''
                        );

                        this.workoutForm.controls.dateStart.controls.month.setValue(
                            date.getMonth() + 1 + ''
                        );

                        this.workoutForm.controls.dateStart.controls.day.setValue(
                            date.getDate() + ''
                        );

                        this.workoutForm.controls.dateStart.controls.hour.setValue(
                            date.getHours() + ''
                        );

                        this.workoutForm.controls.dateStart.controls.minute.setValue(
                            date.getMinutes() + ''
                        );

                        this.workoutDurationInterval = setInterval(() => {
                            this.workoutDuration++;
                        }, 1000);
                    }
                }
            });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.navbarVisibilityService.visibility.next(false);
        });

        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        this.navbarVisibilityService.visibility.next(true);
    }

    addExercises(selectedExercisesIds: Set<string>) {
        this.loading = true;

        selectedExercisesIds.forEach((selectedExerciseId: string) => {
            this.dataService
                .getExercisePreview$(selectedExerciseId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((exercise) => {
                    if (exercise) {
                        this.exercisesPresentionalData.push({
                            custom: exercise.custom,
                            id: exercise.id,
                            name: exercise.name,
                            imagePreviewUrl: exercise.imagePreviewUrl,
                            mainMuscleGroupsIds: exercise.mainMuscleGroupsIds,
                            secondaryMuscleGroupsIds:
                                exercise.secondaryMuscleGroupsIds,
                            equipmentId: exercise.equipmentId,
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
                .getExercisePreview$(initialExercise.exerciseId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((exercise) => {
                    if (exercise) {
                        this.selectedExercisesIds.add(exercise.id);

                        this.exercisesPresentionalData.push({
                            custom: exercise.custom,
                            id: exercise.id,
                            name: exercise.name,
                            imagePreviewUrl: exercise.imagePreviewUrl,
                            mainMuscleGroupsIds: exercise.mainMuscleGroupsIds,
                            secondaryMuscleGroupsIds:
                                exercise.secondaryMuscleGroupsIds,
                            equipmentId: exercise.equipmentId,
                        });

                        const exerciseGroup = this.fb.group({
                            exerciseId: exercise.id,
                            superSetColor: initialExercise.superSetColor,
                            sets: this.fb.array([]),
                        });

                        initialExercise.sets.forEach((set, i) => {
                            if (
                                this.editView === 'done' ||
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

                            if (
                                this.editView === 'current' ||
                                this.editView === 'done'
                            )
                                setFormGroup.addControl(
                                    'isDone',
                                    this.fb.control<boolean>(false)
                                );

                            if (this.editView === 'done') {
                                const isDoneControl = setFormGroup.get(
                                    'isDone'
                                ) as unknown as FormControl<boolean>;

                                isDoneControl.setValue(
                                    initialExercise.sets[i].isDone!
                                );

                                const doneSetsFormControl =
                                    this.workoutComputedValues.get(
                                        'setsDone'
                                    ) as FormControl<number>;

                                const volumeFormControl =
                                    this.workoutComputedValues.get(
                                        'volume'
                                    ) as FormControl<number>;

                                if (initialExercise.sets[i].isDone) {
                                    doneSetsFormControl!.setValue(
                                        doneSetsFormControl.value! + 1
                                    );

                                    volumeFormControl!.setValue(
                                        volumeFormControl.value +
                                            set.weight * set.reps
                                    );
                                }
                            }

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

    removeExercise($event: (number | string)[]) {
        this.selectedExercisesIds.delete($event[0] + '');
        this.exercisesPresentionalData.splice(+$event[1], 1);
        this.workoutExercises.removeAt(+$event[1]);
    }

    summaryLoading: boolean = false;

    saveWorkout() {
        if (this.editView === 'new') {
            this.userService.saveWorkoutTemplate(
                this.workoutForm.getRawValue() as WorkoutTemplate
            );
        }

        if (this.editView === 'existing') {
            this.userService.updateWorkoutTemplate(
                this.workoutId,
                this.workoutForm.getRawValue() as WorkoutTemplate
            );
        }

        if (this.editView === 'current') {
            this.summaryLoading = true;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const workoutFormObjExtended: any =
                this.workoutForm.getRawValue() as WorkoutTemplate;

            this.workoutExercises.controls.forEach((exercise) => {
                const setsFormArray = exercise.get(
                    'sets'
                ) as FormArray<FormGroup>;

                setsFormArray.controls.forEach((set) => {
                    set.removeControl('isDone');
                });
            });

            const workoutFormObjBase =
                this.workoutForm.getRawValue() as WorkoutTemplate;

            workoutFormObjExtended.duration = this.workoutDuration;

            const dateStartObj =
                this.workoutForm.controls.dateStart.getRawValue() as {
                    year: string;
                    month: string;
                    day: string;
                    hour: string;
                    minute: string;
                };

            const dateStart = new Date(
                +dateStartObj.year,
                +dateStartObj.month - 1,
                +dateStartObj.day,
                +dateStartObj.hour,
                +dateStartObj.minute
            );

            workoutFormObjExtended.dateStart = Math.floor(
                dateStart.getTime() / 1000
            );

            workoutFormObjExtended.volume =
                this.workoutComputedValues.controls.volume.value;
            workoutFormObjExtended.setsDone =
                this.workoutComputedValues.controls.setsDone.value;
            workoutFormObjExtended.totalSets = this.totalSets;
            workoutFormObjExtended.exercisesIds = Array.from(
                this.selectedExercisesIds
            );

            const dataForState: WorkoutDoneFull =
                workoutFormObjExtended as WorkoutDoneFull;

            dataForState.workoutTemplateId = this.workoutId;

            dataForState.exercises.forEach((exercise) => {
                exercise.staticData = this.exercisesPresentionalData.find(
                    (presentationalExercise) =>
                        presentationalExercise.id === exercise.exerciseId
                )!;
            });

            this.userService.finishWorkout(
                this.workoutId,
                workoutFormObjExtended as WorkoutDone,
                workoutFormObjBase,
                dataForState
            );
        }

        if (this.editView === 'done') {
            this.summaryLoading = true;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const workoutFormObjExtended: any =
                this.workoutForm.getRawValue() as WorkoutTemplate;

            this.workoutExercises.controls.forEach((exercise) => {
                const setsFormArray = exercise.get(
                    'sets'
                ) as FormArray<FormGroup>;

                setsFormArray.controls.forEach((set) => {
                    set.removeControl('isDone');
                });
            });

            const workoutFormObjBase =
                this.workoutForm.getRawValue() as WorkoutTemplate;

            workoutFormObjExtended.duration = this.workoutDuration;

            const dateStartObj =
                this.workoutForm.controls.dateStart.getRawValue() as {
                    year: string;
                    month: string;
                    day: string;
                    hour: string;
                    minute: string;
                };

            const dateStart = new Date(
                +dateStartObj.year,
                +dateStartObj.month - 1,
                +dateStartObj.day,
                +dateStartObj.hour,
                +dateStartObj.minute
            );

            workoutFormObjExtended.dateStart = Math.floor(
                dateStart.getTime() / 1000
            );

            workoutFormObjExtended.volume =
                this.workoutComputedValues.controls.volume.value;
            workoutFormObjExtended.setsDone =
                this.workoutComputedValues.controls.setsDone.value;
            workoutFormObjExtended.totalSets = this.totalSets;
            workoutFormObjExtended.exercisesIds = Array.from(
                this.selectedExercisesIds
            );

            const dataForState: WorkoutDoneFull =
                workoutFormObjExtended as WorkoutDoneFull;

            dataForState.workoutTemplateId = this.workoutTemplateId!;

            dataForState.exercises.forEach((exercise) => {
                exercise.staticData = this.exercisesPresentionalData.find(
                    (presentationalExercise) =>
                        presentationalExercise.id === exercise.exerciseId
                )!;
            });

            this.userService.updateDoneWorkout(
                this.workoutId,
                workoutFormObjExtended as WorkoutDone,
                workoutFormObjBase,
                dataForState
            );
        }
    }

    changeExercisesOrder(event: CdkDragDrop<ExercisePreview[]>) {
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

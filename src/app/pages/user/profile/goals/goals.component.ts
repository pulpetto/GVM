import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoalComponent } from './goal/goal.component';
import { GoalsCreatorComponent } from './goals-creator/goals-creator.component';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../shared/previous-route-button/previous-route-button.component';
import { UserService } from '../../../../services/user.service';
import {
    filter,
    forkJoin,
    map,
    mergeMap,
    Observable,
    of,
    switchMap,
} from 'rxjs';
import { Goal } from '../../../../interfaces/goal';
import { DataService } from '../../../../services/data.service';
import { WorkoutDoneWithId } from '../../../../interfaces/workout/workout-done-with-id';
import { CurrentGoal } from '../../../../interfaces/goals/current-goal';

@Component({
    selector: 'app-goals',
    standalone: true,
    imports: [
        CommonModule,
        GoalComponent,
        GoalsCreatorComponent,
        ActivityBarComponent,
        PreviousRouteButtonComponent,
    ],
    templateUrl: './goals.component.html',
    styleUrl: './goals.component.css',
})
export class GoalsComponent implements OnInit, AfterViewInit {
    cdr = inject(ChangeDetectorRef);
    userService = inject(UserService);
    dataService = inject(DataService);
    @ViewChildren('tabButton')
    tabButtons!: QueryList<ElementRef>;

    activeTabName: 'current' | 'done' = 'current';
    tabWidthPx!: number;

    doneGoals: Goal[] = [];
    doneGoals$!: Observable<CurrentGoal[]>;

    exerciseSelectorModalVisibility: boolean = false;

    ngOnInit() {
        this.doneGoals$ = this.userService.user$.pipe(
            filter((user) => !!user),
            switchMap(() =>
                this.userService.getGoals().pipe(
                    mergeMap((goals) => {
                        if (goals.length === 0) {
                            return of([]);
                        }

                        return forkJoin(
                            goals.map((goal) =>
                                forkJoin({
                                    doneWorkouts: this.userService
                                        .getDoneWorkoutsByExerciseId(
                                            goal.exerciseId
                                        )
                                        .pipe(
                                            map((workouts) =>
                                                this.calculateEstimated1rm(
                                                    workouts,
                                                    goal.exerciseId
                                                )
                                            )
                                        ),
                                    exerciseData:
                                        this.dataService.getExercisePreview$(
                                            goal.exerciseId
                                        ),
                                }).pipe(
                                    map(({ doneWorkouts, exerciseData }) => ({
                                        id: goal.id,
                                        current1rm: doneWorkouts,
                                        goal1rm: goal.targetWeight,
                                        percentageProgress: Math.round(
                                            (doneWorkouts / goal.targetWeight) *
                                                100
                                        ),
                                        exerciseData,
                                    }))
                                )
                            )
                        );
                    })
                )
            )
        );
    }

    ngAfterViewInit() {
        this.tabWidthPx =
            this.tabButtons.toArray()[0].nativeElement.clientWidth;

        this.cdr.detectChanges();
    }

    calculateEstimated1rm(
        workouts: WorkoutDoneWithId[],
        exerciseId: string
    ): number {
        let estimated1rm = 0;

        workouts.forEach((workout) => {
            const exercise = workout.exercises.find(
                (exercise) => exercise.exerciseId === exerciseId
            );

            let heaviestWeight = 0;
            let reps = 0;

            exercise!.sets.forEach((set) => {
                if (+set.weight > heaviestWeight) {
                    heaviestWeight = +set.weight;
                    reps = +set.reps;
                }
            });

            const oneRm = Math.round(heaviestWeight * (1 + 0.0333 * reps));
            if (oneRm > estimated1rm) {
                estimated1rm = oneRm;
            }
        });

        return estimated1rm;
    }

    switchTab(tabName: string) {
        this.activeTabName = tabName as 'current' | 'done';
    }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { WorkoutDoneFull } from '../../../interfaces/workout/workout-done-full';
import { TimeFormatterPipe } from '../../../pipes/time-formatter.pipe';
import { UserService } from '../../../services/user.service';
import { filter, map, Observable, of, switchMap } from 'rxjs';
import { FullDatePipe } from '../../../pipes/full-date.pipe';
import { ActivityBarComponent } from '../../activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../previous-route-button/previous-route-button.component';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';

const visibleModal = { top: '66.666667%' };
const visibleModalLow = { top: '75%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-workout-done-full-view',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TimeFormatterPipe,
        FullDatePipe,
        ActivityBarComponent,
        PreviousRouteButtonComponent,
        LoadingSpinnerComponent,
    ],
    templateUrl: './workout-done-full-view.component.html',
    styleUrl: './workout-done-full-view.component.css',
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
                animate(timing, style(visibleModalLow)),
            ]),
            transition(':leave', [
                style(visibleModalLow),
                animate(timing, style(hiddenModal)),
            ]),
        ]),
        trigger('openClose5', [
            transition(':enter', [
                style(hiddenBg),
                animate(timing, style(visibleBg)),
            ]),
            transition(':leave', [
                style(visibleBg),
                animate(timing, style(hiddenBg)),
            ]),
        ]),
        trigger('openClose6', [
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
export class WorkoutDoneFullViewComponent implements OnInit {
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    userService = inject(UserService);

    optionsModalVisibility: boolean = false;
    confirmDeleteModalVisibility: boolean = false;
    noSetsDoneExercisesIndexes: Set<number> = new Set();
    workoutData$!: Observable<WorkoutDoneFull>;

    ngOnInit() {
        if (history.state.name) {
            this.workoutData$ = of(history.state);

            this.workoutData$.pipe(
                map((workout) => this.checkForEmptyExercises(workout))
            );
        } else {
            const exerciseId = this.activatedRoute.snapshot.paramMap.get('id');

            this.workoutData$ = this.userService.user$.pipe(
                filter((user) => !!user),
                switchMap(() =>
                    this.userService
                        .getDoneWorkoutByIdWithExercises(exerciseId!)
                        .pipe(
                            map((workout) =>
                                this.checkForEmptyExercises(workout)
                            )
                        )
                )
            );
        }
    }

    checkForEmptyExercises(workout: WorkoutDoneFull): WorkoutDoneFull {
        workout.exercises.forEach((exercise, i) => {
            if (exercise.sets.every((set) => set.isDone === false)) {
                this.noSetsDoneExercisesIndexes.add(i);
            }
        });
        return workout;
    }

    navigateToSummary(workoutData: WorkoutDoneFull) {
        this.router.navigate(['summary'], {
            relativeTo: this.activatedRoute,
            state: workoutData,
        });
    }

    navigateToEditView(workoutData: WorkoutDoneFull) {
        this.router.navigate([`user/workout/${workoutData.id}/edit`], {
            queryParams: { editView: 'done' },
            state: workoutData,
        });
    }

    deleteWorkout(workoutTemplateId: string, workoutId: string) {
        this.optionsModalVisibility = false;
        this.confirmDeleteModalVisibility = false;

        this.userService.deleteDoneWorkout(workoutTemplateId, workoutId);
    }
}

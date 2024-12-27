import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { animate, style, transition, trigger } from '@angular/animations';
import { DataService } from '../../../services/data.service';
import { Set } from '../../../interfaces/workout/set';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerComponent } from '../../loading-spinner/loading-spinner.component';
import { ActivityBarComponent } from '../../activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../previous-route-button/previous-route-button.component';

const visibleModal = { top: '66.666667%' };
const visibleModalLow = { top: '75%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-workout-template-full-view',
    standalone: true,
    templateUrl: './workout-template-full-view.component.html',
    styleUrl: './workout-template-full-view.component.css',
    imports: [
        CommonModule,
        RouterModule,
        LoadingSpinnerComponent,
        ActivityBarComponent,
        PreviousRouteButtonComponent,
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
export class WorkoutTemplateFullViewComponent implements OnInit {
    workoutId!: string;
    splitId!: string;
    optionsModalVisibility: boolean = false;
    confirmDeleteModalVisibility: boolean = false;
    workoutData$!: Observable<{
        name: string;
        exercises: {
            exerciseId: string;
            sets: Set[];
            name: string;
            imageUrl: string;
        }[];
    }>;

    destroyRef = inject(DestroyRef);

    constructor(
        private route: ActivatedRoute,
        private userService: UserService,
        private dataService: DataService
    ) {}

    ngOnInit() {
        this.route.paramMap
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((params) => {
                this.workoutId = params.get('workoutId')!;
            });

        this.route.queryParams
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((queryParams) => {
                this.splitId = queryParams['splitId'];
            });

        this.userService.user$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((user) => {
                if (user && this.workoutId) {
                    this.workoutData$ = this.userService
                        .getWorkoutTemplateById(this.workoutId)
                        .pipe(
                            switchMap((workout) =>
                                forkJoin(
                                    workout.exercises.map((exercise) =>
                                        this.dataService
                                            .getExercisePreview$(
                                                exercise.exerciseId
                                            )
                                            .pipe(
                                                map((exerciseDetails) => ({
                                                    ...exercise,
                                                    name: exerciseDetails!.name,
                                                    imageUrl:
                                                        exerciseDetails!
                                                            .imagePreviewUrl,
                                                }))
                                            )
                                    )
                                ).pipe(
                                    map((exercises) => ({
                                        ...workout,
                                        exercises,
                                    }))
                                )
                            )
                        );
                }
            });
    }

    deleteWorkout() {
        this.userService.deleteWorkoutTemplate(this.splitId, this.workoutId);
    }
}

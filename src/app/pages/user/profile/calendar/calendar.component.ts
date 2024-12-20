import {
    Component,
    computed,
    DestroyRef,
    inject,
    Inject,
    OnInit,
    Renderer2,
    Signal,
    signal,
    WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DateTime, Info, Interval } from 'luxon';
import { animate, style, transition, trigger } from '@angular/animations';
import { UserService } from '../../../../services/user.service';
import { forkJoin, Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WorkoutDonePreviewComponent } from '../../../../shared/workoutViews/workout-done-preview/workout-done-preview.component';
import { WorkoutDoneFull } from '../../../../interfaces/workout/workout-done-full';
import { MonthNamePipe } from '../../../../pipes/month-name.pipe';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../shared/previous-route-button/previous-route-button.component';

const visibleModal = { top: '25%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

export interface WorkoutUnixWithId {
    unixTimestamp: number;
    workoutId: string;
}

@Component({
    selector: 'app-calendar',
    standalone: true,
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.css',
    imports: [
        CommonModule,
        RouterModule,
        WorkoutDonePreviewComponent,
        MonthNamePipe,
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
    ],
})
export class CalendarComponent implements OnInit {
    destroyRef = inject(DestroyRef);
    userService = inject(UserService);

    today: Signal<DateTime> = signal(
        DateTime.local().setZone('America/New_York')
    );
    firstDayOfActiveMonth: WritableSignal<DateTime> = signal(
        this.today().startOf('month')
    );

    activeDay: WritableSignal<DateTime | null> = signal(null);

    weekDays: Signal<string[]> = signal(Info.weekdays('short'));
    daysOfMonth: Signal<DateTime[]> = computed(() => {
        return Interval.fromDateTimes(
            this.firstDayOfActiveMonth().startOf('week'),
            this.firstDayOfActiveMonth().endOf('month').endOf('week')
        )
            .splitBy({ day: 1 })
            .map((d) => {
                if (d.start === null) {
                    throw new Error('Wrong dates');
                }
                return d.start;
            });
    });

    DATE_MED = DateTime.DATE_MED;

    oldestActiveMonth!: number;
    oldestActiveYear!: number;

    loading: boolean = true;

    monthCache: { [key: string]: (WorkoutUnixWithId[] | null)[] } = {};

    daysActivity: (WorkoutUnixWithId[] | null)[] = [];

    allActiveMonths: { year: number; month: number }[] = [];

    ngOnInit() {
        this.userService.user$.subscribe((user) => {
            if (user) {
                this.userService
                    .getOldestDoneWorkoutsUnix()
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((data) => {
                        if (data) {
                            this.oldestActiveMonth =
                                DateTime.fromSeconds(data).month;
                            this.oldestActiveYear =
                                DateTime.fromSeconds(data).year;

                            let currentDate = DateTime.local(
                                this.oldestActiveYear,
                                this.oldestActiveMonth
                            );

                            const now = DateTime.now();

                            while (currentDate <= now) {
                                this.allActiveMonths.push({
                                    year: currentDate.year,
                                    month: currentDate.month,
                                });

                                currentDate = currentDate.plus({ months: 1 });
                            }
                        }
                    });

                this.getActivityForMonth();
            }
        });
    }

    getActivityForMonth() {
        this.loading = true;
        this.daysActivity = [];

        const lastDayOfActiveMonth: DateTime = this.firstDayOfActiveMonth()
            .endOf('month')
            .set({
                hour: 23,
                minute: 59,
                second: 59,
            });

        this.userService
            .getWorkoutsByUnixRange(
                this.firstDayOfActiveMonth().toSeconds(),
                lastDayOfActiveMonth.toSeconds()
            )
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
                if (data) {
                    this.daysOfMonth().forEach((day) => {
                        const startOfDay = day.toSeconds();
                        const endOfDay = day
                            .set({
                                hour: 23,
                                minute: 59,
                                second: 59,
                            })
                            .toSeconds();

                        const workoutsInDay = data.filter(
                            (workout) =>
                                workout.unixTimestamp >= startOfDay &&
                                workout.unixTimestamp <= endOfDay
                        );

                        if (workoutsInDay.length > 0) {
                            this.daysActivity.push(workoutsInDay);
                        } else {
                            this.daysActivity.push(null);
                        }
                    });

                    this.monthCache[
                        `${this.firstDayOfActiveMonth().month}${
                            this.firstDayOfActiveMonth().year
                        }`
                    ] = this.daysActivity;

                    setTimeout(() => {
                        this.loading = false;
                    }, 500);
                }
            });
    }

    displayedWorkouts$!: Observable<WorkoutDoneFull[] | null>;

    setActiveDay(dayOfMonth: DateTime<boolean>, i: number) {
        if (this.activeDay() === dayOfMonth) {
            this.activeDay.set(null);
        } else {
            this.activeDay.set(dayOfMonth);

            if (this.daysActivity[i]) {
                const workoutObservables: Observable<WorkoutDoneFull>[] =
                    this.daysActivity[i]!.map((day) =>
                        this.userService.getDoneWorkoutByIdWithExercises(
                            day.workoutId
                        )
                    );

                this.displayedWorkouts$ = forkJoin(workoutObservables);
            } else {
                this.displayedWorkouts$ = of([]);
            }
        }
    }

    goToAdjacentMonth(side: 'next' | 'prev') {
        if (side === 'next') {
            this.firstDayOfActiveMonth.set(
                this.firstDayOfActiveMonth().plus({ month: 1 })
            );
        } else {
            this.firstDayOfActiveMonth.set(
                this.firstDayOfActiveMonth().minus({ month: 1 })
            );
        }

        this.activeDay.set(null);

        if (
            !this.monthCache[
                `${this.firstDayOfActiveMonth().month}${
                    this.firstDayOfActiveMonth().year
                }`
            ]
        ) {
            this.getActivityForMonth();
        } else {
            this.daysActivity =
                this.monthCache[
                    `${this.firstDayOfActiveMonth().month}${
                        this.firstDayOfActiveMonth().year
                    }`
                ];
        }
    }

    goToCurrentMonth() {
        this.firstDayOfActiveMonth.set(this.today().startOf('month'));
    }

    changeMonth(year: number, month: number) {
        this.firstDayOfActiveMonth.set(DateTime.local(year, month, 1));

        if (
            !this.monthCache[
                `${this.firstDayOfActiveMonth().month}${
                    this.firstDayOfActiveMonth().year
                }`
            ]
        ) {
            this.getActivityForMonth();
        } else {
            this.daysActivity =
                this.monthCache[
                    `${this.firstDayOfActiveMonth().month}${
                        this.firstDayOfActiveMonth().year
                    }`
                ];
        }

        this.monthChangeModalVisibility = false;
    }

    // ---------- ---------- ---------- ---------- ----------

    monthChangeModalVisibility: boolean = false;

    constructor(
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document
    ) {}

    toggleModalVisibility() {
        this.monthChangeModalVisibility = !this.monthChangeModalVisibility;

        // prettier-ignore
        this.monthChangeModalVisibility
            ? this.renderer.addClass(this.document.body, 'overflow-y-hidden')
            : this.renderer.removeClass(
                this.document.body,
                'overflow-y-hidden'
            );
    }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { NumericStatisticsComponent } from './numeric-statistics/numeric-statistics.component';
import { UserService } from '../../../../services/user.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { WorkoutDone } from '../../../../interfaces/workout/workout-done';
import { DateTime } from 'luxon';
import { filter, switchMap } from 'rxjs';
import { LineChartComponent } from '../../../../shared/line-chart/line-chart.component';
import { RadarChartComponent } from '../../../../shared/radar-chart/radar-chart.component';

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-statistics',
    standalone: true,
    imports: [
        CommonModule,
        NumericStatisticsComponent,
        LineChartComponent,
        RadarChartComponent,
    ],
    templateUrl: './statistics.component.html',
    styleUrl: './statistics.component.css',
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
export class StatisticsComponent implements OnInit {
    userService = inject(UserService);

    dataTypeModalVisibility: boolean = false;
    dataTypes = [
        'Rep ranges types',
        'Training intensity',
        'Muscle groups distribution',
        'Workouts duration',
        'Workouts volume',
        'Workouts reps',
    ];
    activeDataType!: string;

    periods = ['1M', '3M', '6M', '1Y', 'ALL'];
    activePeriod!: string;

    workouts!: WorkoutDone[];

    chartData!: number[];
    chartLabels!: string[];
    chartMaxLabelsLimit!: number;

    workoutsAmount: number = 0;
    setsAmount: number = 0;
    repsAmount: number = 0;
    timeSpentUnix: number = 0;
    volume: number = 0;

    oldestFetchedDate!: DateTime;

    ngOnInit() {
        const now = DateTime.now();
        this.oldestFetchedDate = now.minus({ months: 1 });

        this.userService.user$
            .pipe(
                filter((user) => !!user),
                switchMap(() => this.userService.getAllDoneWorkouts())
            )
            .subscribe((data) => {
                this.workouts = data;

                this.activeDataType = this.dataTypes[0];
                this.activePeriod = this.periods[0];

                this.changeDataType(this.activeDataType);
            });
    }

    changeDataType(dataType: string) {
        this.activeDataType = dataType;

        if (dataType === 'Rep ranges types') {
            this.chartLabels = ['Strength', 'Hypertrophy', 'Endurance'];
            this.chartData = [0, 0, 0];

            this.workouts.forEach((workout) =>
                workout.exercises.forEach((exercise) =>
                    exercise.sets.forEach((set) => {
                        if (set.isDone) {
                            if (set.reps <= 5) {
                                this.chartData[0]++;
                            }

                            if (set.reps >= 6 && set.reps <= 20) {
                                this.chartData[1]++;
                            }

                            if (set.reps > 20) {
                                this.chartData[2]++;
                            }
                        }
                    })
                )
            );
        }

        if (dataType === 'Training intensity') {
            this.chartLabels = ['Failure', 'RPE 8-9', 'RPE 6-7'];
            this.chartData = [0, 0, 0];

            this.workouts.forEach((workout) =>
                workout.exercises.forEach((exercise) =>
                    exercise.sets.forEach((set) => {
                        if (set.isDone) {
                            if (set.rpe === 'F') {
                                this.chartData[0]++;
                            }

                            if (set.rpe === 8 || set.rpe === 9) {
                                this.chartData[1]++;
                            }

                            if (set.rpe === 7 || set.rpe === 6) {
                                this.chartData[2]++;
                            }
                        }
                    })
                )
            );
        }

        if (dataType === 'Workouts duration') {
            this.workouts.forEach((workout) => {
                this.chartData.push(workout.duration);
            });
        }

        if (dataType === 'Workouts reps') {
            this.workouts.forEach((workout) => {
                workout.exercises.forEach((exercise) =>
                    exercise.sets.forEach((set) => {
                        if (set.isDone) {
                            this.chartData.push(+set.reps);
                        }
                    })
                );
            });
        }

        if (dataType === 'Workouts volume') {
            this.workouts.forEach((workout) => {
                workout.exercises.forEach((exercise) =>
                    exercise.sets.forEach((set) => {
                        if (set.isDone) {
                            this.chartData.push(+set.reps * +set.weight);
                        }
                    })
                );
            });
        }

        this.changePeriod('1M');
    }

    changePeriod(period: string) {
        this.activePeriod = period;

        const now = DateTime.now();
        let startDate: DateTime | null;

        if (period === '1M') startDate = now.minus({ months: 1 });

        if (period === '3M') startDate = now.minus({ months: 3 });

        if (period === '6M') startDate = now.minus({ months: 6 });

        if (period === '1Y') startDate = now.minus({ years: 1 });

        if (period === 'ALL') startDate = null;

        const workouts: WorkoutDone[] = this.workouts.filter(
            (workout) =>
                workout.dateStart >=
                (startDate ? startDate!.toUnixInteger() : 0)
        );

        if (
            this.activeDataType === 'Workouts duration' ||
            this.activeDataType === 'Workouts reps' ||
            this.activeDataType === 'Workouts volume'
        )
            this.setLineChartLabels(workouts);

        this.setNumericStats(workouts);

        this.dataTypeModalVisibility = false;
    }

    setLineChartLabels(workouts: WorkoutDone[]) {
        this.chartLabels = [];

        workouts.forEach((workout) => {
            if (this.activePeriod === '1M') {
                this.chartMaxLabelsLimit = 5;

                this.chartLabels.push(
                    DateTime.fromMillis(workout.dateStart * 1000).toFormat(
                        'MMM d'
                    )
                );
            }

            if (this.activePeriod === '3M') {
                this.chartMaxLabelsLimit = 5;

                this.chartLabels.push(
                    DateTime.fromMillis(workout.dateStart * 1000).setLocale(
                        'en'
                    ).monthLong!
                );
            }

            if (this.activePeriod === '6M' || this.activePeriod === '1Y') {
                this.chartMaxLabelsLimit = 5;

                this.chartLabels.push(
                    DateTime.fromMillis(workout.dateStart * 1000).setLocale(
                        'en'
                    ).monthShort!
                );
            }

            if (this.activePeriod === 'ALL') {
                this.chartMaxLabelsLimit = 5;

                this.chartLabels.push(
                    DateTime.fromMillis(workout.dateStart * 1000).year + ''
                );
            }
        });
    }

    setNumericStats(workouts: WorkoutDone[]) {
        this.workoutsAmount = workouts.length;
        this.timeSpentUnix = 0;
        this.setsAmount = 0;
        this.repsAmount = 0;
        this.volume = 0;

        workouts.forEach((workout) => {
            this.timeSpentUnix += workout.duration;

            workout.exercises.forEach((exercise) =>
                exercise.sets.forEach((set) => {
                    if (set.isDone) {
                        this.setsAmount++;
                        this.repsAmount += +set.reps;
                        this.volume += +set.reps * +set.weight;
                    }
                })
            );
        });
    }
}

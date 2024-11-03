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
        'Muscle groups distribution',
        'Training intensity',
        'Rep ranges types',
        'Workouts duration',
        'Workouts volume',
        'Workouts reps',
    ];
    activeDataType!: string;

    periods = ['1M', '3M', '6M', 'YTD', '1Y', 'ALL'];
    activePeriod!: string;

    workouts!: WorkoutDone[];

    chartData!: number[];
    chartLabels!: string[];

    setsAmount: number = 0;
    repsAmount: number = 0;
    timeSpentUnix: number = 0;
    volume: number = 0;

    ngOnInit() {
        const now = DateTime.now();
        const startDate = now.minus({ months: 1 });

        this.userService.user$
            .pipe(
                filter((user) => !!user),
                switchMap(() =>
                    this.userService.getDoneWorkoutsStartingFromUnix(
                        startDate.toUnixInteger()
                    )
                )
            )
            .subscribe((data) => {
                this.workouts = data;

                this.workouts.forEach((workout) => {
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
            });

        this.activeDataType = this.dataTypes[0];
        this.activePeriod = this.periods[0];
    }

    changePeriod(period: string) {
        this.activePeriod = period;
    }

    changeDataType(dataType: string) {
        this.activeDataType = dataType;

        this.dataTypeModalVisibility = false;
    }
}

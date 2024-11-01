import { Component, Input, OnInit } from '@angular/core';
import { LineChartComponent } from '../../line-chart/line-chart.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { WorkoutDoneWithId } from '../../../interfaces/workout/workout-done-with-id';
import { DateTime } from 'luxon';

const visibleModal = { top: '25%' };
const visibleModalTop50 = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-exercise-charts',
    standalone: true,
    imports: [LineChartComponent, CommonModule],
    templateUrl: './exercise-charts.component.html',
    styleUrl: './exercise-charts.component.css',
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
export class ExerciseChartsComponent implements OnInit {
    @Input({ required: true }) workouts!: WorkoutDoneWithId[];
    @Input({ required: true }) exerciseId!: string;

    maxLabelsLimit!: number;
    labels: string[] = [];
    periodModalVisibility: boolean = false;
    periods = [
        'Last month',
        'Last 3 months',
        'Last 6 months',
        'Last year',
        'Last 5 workouts',
        'Last 10 workouts',
        'Last 20 workouts',
        'All time',
    ];
    activePeriod: string = '';

    data: number[] = [];
    suffix: string | null = null;
    dataTypeModalVisibility: boolean = false;
    dataTypes = [
        'Estimated 1rm',
        'Heaviest weight used',
        'Reps per workout',
        'Sets per workout',
        'Volume per workout',
    ];
    activeDataType: string = this.dataTypes[0];

    ngOnInit() {
        this.activePeriod = 'Last month';
        this.changeDataType('Estimated 1rm');
    }

    changeDataType(dataType: string) {
        this.data = [];
        this.labels = [];
        this.activeDataType = dataType;

        this.workouts.forEach((workout) => {
            const exercise = workout.exercises.find(
                (exercise) => exercise.exerciseId === this.exerciseId
            );

            if (this.activeDataType === 'Estimated 1rm') {
                let heaviestWeight = 0;
                let reps = 0;

                exercise!.sets.forEach((set) => {
                    if (+set.weight > heaviestWeight) {
                        heaviestWeight = +set.weight;
                        reps = +set.reps;
                    }
                });

                const estimated1rm = heaviestWeight * (1 + 0.0333 * reps);

                this.suffix = 'kg';

                this.data.push(Math.round(estimated1rm));
            }

            if (this.activeDataType === 'Heaviest weight used') {
                let heaviestWeight = 0;

                exercise!.sets.forEach((set) => {
                    if (+set.weight > heaviestWeight) {
                        heaviestWeight = +set.weight;
                    }
                });

                this.suffix = 'kg';

                this.data.push(heaviestWeight);
            }

            if (this.activeDataType === 'Reps per workout') {
                let repsInWorkout = 0;

                exercise!.sets.forEach((set) => {
                    repsInWorkout += +set.reps;
                });

                this.suffix = null;

                this.suffix = ' reps';

                this.data.push(repsInWorkout);
            }

            if (this.activeDataType === 'Sets per workout') {
                let setsInWorkout = 0;

                setsInWorkout = exercise!.sets.length;

                this.suffix = null;

                this.suffix = ' sets';

                this.data.push(setsInWorkout);
            }

            if (this.activeDataType === 'Volume per workout') {
                let volumeInWorkout = 0;

                exercise!.sets.forEach((set) => {
                    volumeInWorkout += +set.weight;
                });

                this.suffix = 'kg';

                this.data.push(volumeInWorkout);
            }
        });

        this.changePeriod('Last month');

        this.dataTypeModalVisibility = false;
    }

    changePeriod(period: string) {
        this.labels = [];

        this.activePeriod = period;

        const now = DateTime.now();
        let startDate: DateTime;

        if (period === 'Last month') startDate = now.minus({ months: 1 });

        if (period === 'Last 3 months') startDate = now.minus({ months: 3 });

        if (period === 'Last 6 months') startDate = now.minus({ months: 6 });

        if (period === 'Last year') startDate = now.minus({ years: 1 });

        this.workouts
            .filter(
                (workout) =>
                    DateTime.fromMillis(workout.dateStart * 1000).toMillis() >=
                    startDate.toMillis()
            )
            .forEach((workout) => {
                if (this.activePeriod === 'Last month') {
                    this.maxLabelsLimit = 5;

                    this.labels.push(
                        DateTime.fromMillis(workout.dateStart * 1000).toFormat(
                            'MMM d'
                        )
                    );
                }

                if (this.activePeriod === 'Last 3 months') {
                    this.maxLabelsLimit = 3;

                    this.labels.push(
                        DateTime.fromMillis(workout.dateStart * 1000).setLocale(
                            'en'
                        ).monthLong!
                    );
                }

                if (
                    this.activePeriod === 'Last 6 months' ||
                    this.activePeriod === 'Last year'
                ) {
                    this.maxLabelsLimit = 6;

                    this.labels.push(
                        DateTime.fromMillis(workout.dateStart * 1000).setLocale(
                            'en'
                        ).monthShort!
                    );
                }

                if (this.activePeriod === 'All time') {
                    this.maxLabelsLimit = 3;

                    this.labels.push(
                        DateTime.fromMillis(workout.dateStart * 1000).year + ''
                    );
                }
            });

        this.periodModalVisibility = false;
    }
}

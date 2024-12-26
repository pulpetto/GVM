import { Component, Input, OnInit } from '@angular/core';
import { LineChartComponent } from '../../line-chart/line-chart.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { WorkoutDoneWithId } from '../../../interfaces/workout/workout-done-with-id';
import { DateTime } from 'luxon';

const visibleModal = { top: '50%' };
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
    ],
})
export class ExerciseChartsComponent implements OnInit {
    @Input({ required: true }) workouts!: WorkoutDoneWithId[];
    workoutsForTimeframe!: WorkoutDoneWithId[];
    @Input({ required: true }) exerciseId!: string;

    tooLittleData: boolean = false;

    labels: string[] = [];
    periodModalVisibility: boolean = false;
    periods = ['1M', '3M', '6M', '1Y', 'ALL'];
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
        this.activeDataType = 'Estimated 1rm';
        this.activePeriod = '1M';

        this.changePeriod('1M');
    }

    changeDataType(dataType: string) {
        this.activeDataType = dataType;
        this.data = [];

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

        this.dataTypeModalVisibility = false;
    }

    validateDataAmount(
        workouts: WorkoutDoneWithId[],
        totalDays: number,
        periods: number
    ) {
        const now = DateTime.now();
        const daysPerPeriod = totalDays / periods;

        const timePeriods = Array.from({ length: periods }, (_, i) => ({
            start: now
                .minus({ days: totalDays - i * daysPerPeriod })
                .toMillis(),
            end: now
                .minus({ days: totalDays - (i + 1) * daysPerPeriod })
                .toMillis(),
        }));

        const canBeShown = timePeriods.every((period) =>
            workouts.some(
                (workout) =>
                    workout.dateStart * 1000 < period.end &&
                    workout.dateStart * 1000 > period.start
            )
        );

        if (canBeShown) {
            this.tooLittleData = false;
        } else {
            this.tooLittleData = true;
        }
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

        this.workoutsForTimeframe = this.workouts.filter(
            (workout) =>
                workout.dateStart >=
                (startDate ? startDate!.toUnixInteger() : 0)
        );

        if (period === '1M')
            this.validateDataAmount(this.workoutsForTimeframe, 30, 1);

        if (period === '3M')
            this.validateDataAmount(this.workoutsForTimeframe, 90, 3);

        if (period === '6M')
            this.validateDataAmount(this.workoutsForTimeframe, 180, 6);

        if (period === '1Y')
            this.validateDataAmount(this.workoutsForTimeframe, 365, 12);

        if (period === 'ALL') this.tooLittleData = false;

        this.setLineChartLabels(this.workoutsForTimeframe);
        this.changeDataType(this.activeDataType);

        this.dataTypeModalVisibility = false;
    }

    setLineChartLabels(workouts: WorkoutDoneWithId[]) {
        this.labels = [];

        workouts.forEach((workout) =>
            this.labels.push(
                DateTime.fromMillis(workout.dateStart * 1000).toFormat('MMM d')
            )
        );
    }
}

import { Component } from '@angular/core';
import { LineChartComponent } from '../../line-chart/line-chart.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';

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
export class ExerciseChartsComponent {
    periodModalVisibility: boolean = false;
    periods = [
        'Last month',
        'Last 3 months',
        'Last 6 months',
        'Last 12 months',
        'Last 5 workouts',
        'Last 10 workouts',
        'Last 20 workouts',
        'All time',
    ];
    activePeriod: string = '';

    dataTypeModalVisibility: boolean = false;
    dataTypes = [
        'Estimated 1rm',
        'Heaviest weight used',
        'Reps per workout',
        'Sets per workout',
        'Volume per workout',
    ];
    activeDataType: string = this.dataTypes[0];
}

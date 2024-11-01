import { Component, OnInit } from '@angular/core';
import { LineChartComponent } from '../../../../../shared/line-chart/line-chart.component';
import { RadarChartComponent } from '../../../../../shared/radar-chart/radar-chart.component';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-statistics-charts',
    standalone: true,
    imports: [LineChartComponent, RadarChartComponent, CommonModule],
    templateUrl: './statistics-charts.component.html',
    styleUrl: './statistics-charts.component.css',
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
export class StatisticsChartsComponent implements OnInit {
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

    ngOnInit() {
        this.changeDataType(this.dataTypes[0]);
    }

    changeDataType(dataType: string) {
        this.activeDataType = dataType;

        this.dataTypeModalVisibility = false;
    }
}

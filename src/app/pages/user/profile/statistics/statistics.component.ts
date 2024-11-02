import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { StatisticsChartsComponent } from './statistics-charts/statistics-charts.component';
import { NumericStatisticsComponent } from './numeric-statistics/numeric-statistics.component';
import { UserService } from '../../../../services/user.service';
import { animate, style, transition, trigger } from '@angular/animations';

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
        StatisticsChartsComponent,
        NumericStatisticsComponent,
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

    ngOnInit() {
        this.changeDataType(this.dataTypes[0]);
        this.activePeriod = this.periods[0];
    }

    changeDataType(dataType: string) {
        this.activeDataType = dataType;

        this.dataTypeModalVisibility = false;
    }
}

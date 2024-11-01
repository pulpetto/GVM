import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatisticsChartsComponent } from './statistics-charts/statistics-charts.component';
import { NumericStatisticsComponent } from './numeric-statistics/numeric-statistics.component';

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
})
export class StatisticsComponent {}

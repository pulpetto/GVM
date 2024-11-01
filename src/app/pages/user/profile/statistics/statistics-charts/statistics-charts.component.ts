import { Component } from '@angular/core';
import { LineChartComponent } from '../../../../../shared/line-chart/line-chart.component';
import { RadarChartComponent } from '../../../../../shared/radar-chart/radar-chart.component';

@Component({
    selector: 'app-statistics-charts',
    standalone: true,
    imports: [LineChartComponent, RadarChartComponent],
    templateUrl: './statistics-charts.component.html',
    styleUrl: './statistics-charts.component.css',
})
export class StatisticsChartsComponent {
    dataTypes = [
        'Muscle groups distribution',
        'Training intensity',
        'Rep ranges types',
        'Workouts duration',
        'Workouts volume',
        'Workouts reps',
    ];
    activeDataType!: string;
}

import { Component, Input } from '@angular/core';
import { LineChartComponent } from '../../../../../shared/line-chart/line-chart.component';
import { RadarChartComponent } from '../../../../../shared/radar-chart/radar-chart.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-statistics-charts',
    standalone: true,
    imports: [LineChartComponent, RadarChartComponent, CommonModule],
    templateUrl: './statistics-charts.component.html',
    styleUrl: './statistics-charts.component.css',
})
export class StatisticsChartsComponent {
    @Input({ required: true }) activeDataType!: string;
}

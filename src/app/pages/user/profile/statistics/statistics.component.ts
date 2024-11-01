import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { StatisticsChartsComponent } from './statistics-charts/statistics-charts.component';

@Component({
    selector: 'app-statistics',
    standalone: true,
    imports: [CommonModule, StatisticsChartsComponent],
    templateUrl: './statistics.component.html',
    styleUrl: './statistics.component.css',
})
export class StatisticsComponent {}

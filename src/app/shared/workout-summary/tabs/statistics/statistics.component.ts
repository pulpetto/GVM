import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';

@Component({
    selector: 'app-statistics',
    standalone: true,
    imports: [BaseChartDirective],
    templateUrl: './statistics.component.html',
    styleUrl: './statistics.component.css',
})
export class StatisticsComponent {
    constructor() {
        Chart.register(...registerables);
    }

    data = {
        labels: ['Chest', 'Back', 'Arms', 'Abs', 'Legs', 'Shoulders'],
        datasets: [
            {
                label: 'My First Dataset',
                data: [2, 4, 3, 1, 5, 4],
                fill: true,
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: '#10b981',
                pointBackgroundColor: '#047857',
                pointBorderColor: '#10b981',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#10b981',
            },
        ],
    };

    config = {
        type: 'radar',
        data: this.data,
        options: {
            elements: {
                line: {
                    borderWidth: 3,
                },
            },
        },
    };
}

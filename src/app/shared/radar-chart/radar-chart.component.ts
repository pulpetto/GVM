import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    ViewChild,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-radar-chart',
    standalone: true,
    imports: [],
    templateUrl: './radar-chart.component.html',
    styleUrl: './radar-chart.component.css',
})
export class RadarChartComponent implements AfterViewInit {
    @ViewChild('chart') myChart!: ElementRef<HTMLCanvasElement>;
    chart!: Chart;

    @Input({ required: true }) data!: number[];
    @Input({ required: true }) labels!: string[];

    ngAfterViewInit() {
        this.initChart();
    }

    private initChart(): void {
        const ctx = this.myChart.nativeElement.getContext('2d');

        if (ctx) {
            this.chart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: this.labels,
                    datasets: [
                        {
                            label: 'Athlete A',
                            data: this.data,
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            borderColor: 'rgba(16, 185, 129, 1)',
                            borderWidth: 2,
                            pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                            pointRadius: 0,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        r: {
                            beginAtZero: false,
                            ticks: {
                                display: false,
                                // stepSize: 20,
                            },
                            grid: {
                                color: 'rgba(23, 23, 23, 0)',
                            },
                            // 10 - 950
                            // 23 - 900
                            // 38 - 800
                            // 64 - 700
                            angleLines: {
                                color: 'rgb(23 23 23)',
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            enabled: false,
                            callbacks: {
                                label: (tooltipItem) => {
                                    const label = tooltipItem.label;
                                    const value = tooltipItem.raw as number;
                                    return `${label}: ${value}`;
                                },
                            },
                        },
                    },
                    elements: {
                        line: {
                            tension: 0,
                        },
                    },
                },
            });
        }
    }
}

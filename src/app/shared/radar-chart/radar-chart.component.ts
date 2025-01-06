import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnChanges,
    SimpleChanges,
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
export class RadarChartComponent implements AfterViewInit, OnChanges {
    @ViewChild('chart') myChart!: ElementRef<HTMLCanvasElement>;
    chart!: Chart;

    @Input({ required: true }) data!: number[];
    @Input({ required: true }) labels!: string[];

    ngAfterViewInit() {
        this.initChart();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] || changes['labels']) {
            if (this.chart) {
                this.chart.data.datasets[0].data = this.data;
                this.chart.data.labels = this.labels;
                this.chart.update();
            }
        }
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
                            },
                            grid: {
                                color: 'rgba(23, 23, 23, 0)',
                            },
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

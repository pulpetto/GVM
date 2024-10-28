import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, ChartEvent, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-line-chart',
    standalone: true,
    imports: [],
    templateUrl: './line-chart.component.html',
    styleUrl: './line-chart.component.css',
})
export class LineChartComponent implements AfterViewInit {
    @ViewChild('chart') myChart!: ElementRef<HTMLCanvasElement>;
    chart!: Chart;

    data: number[] = [10, 15, 20, 25, 15];

    clickedData!: number;
    clickedX: number | null = null;

    hoveredData: number | null = null;
    hoveredX: number | null = null;

    ngAfterViewInit() {
        this.initChart();
    }

    private initChart(): void {
        const ctx = this.myChart.nativeElement.getContext('2d');

        if (ctx) {
            const gradient = ctx.createLinearGradient(
                0,
                0,
                0,
                this.myChart.nativeElement.height
            );
            gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
            gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');

            const verticalLinePlugin = {
                id: 'verticalLinePlugin',
                afterDatasetsDraw: (chart: Chart) => {
                    if (this.hoveredX !== null) {
                        const ctx = chart.ctx;
                        const x = this.hoveredX;
                        const yAxis = chart.scales['y'];

                        ctx.save();
                        ctx.beginPath();
                        ctx.setLineDash([5, 5]);
                        ctx.moveTo(x, yAxis.top);
                        ctx.lineTo(x, yAxis.bottom);
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
                        ctx.stroke();
                        ctx.restore();
                    }
                },
            };

            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Nov 1', 'Nov 8', 'Nov 15', 'Nov 22', 'Nov 29'],
                    datasets: [
                        {
                            label: 'Reps',
                            data: [30, 20, 40, 50, 35],
                            borderColor: '#10b981',
                            backgroundColor: gradient,
                            fill: true,
                            borderWidth: 2.5,
                            pointBackgroundColor: '#10b981',
                            pointRadius: 1.5,
                        },
                    ],
                },

                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false,
                        },
                        tooltip: {
                            enabled: true,
                            mode: 'index',
                            intersect: false,
                        },
                    },
                    onHover: (event: ChartEvent) => {
                        const points = this.chart.getElementsAtEventForMode(
                            event as unknown as Event,
                            'index',
                            { intersect: false },
                            true
                        );

                        if (points.length) {
                            const firstPoint = points[0];
                            const value = this.chart.data.datasets[
                                firstPoint.datasetIndex!
                            ].data[firstPoint.index!] as number;

                            this.hoveredData = value;
                            this.hoveredX = firstPoint.element.x;
                        } else {
                            this.hoveredData = null;
                            this.hoveredX = null;
                        }

                        this.chart.update();
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgb(23, 23, 23, 0)',
                            },
                        },
                        y: {
                            grid: {
                                color: 'rgb(23, 23, 23, 1)',
                            },
                            beginAtZero: false,
                        },
                    },
                },
                plugins: [verticalLinePlugin],
            });
        }
    }
}

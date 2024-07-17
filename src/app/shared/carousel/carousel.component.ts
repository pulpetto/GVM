import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
    ChartConfiguration,
    ChartOptions,
    Chart,
    registerables,
} from 'chart.js';
@Component({
    selector: 'app-carousel',
    standalone: true,
    imports: [CommonModule, BaseChartDirective],
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.css',
})
export class CarouselComponent {
    constructor() {
        Chart.register(...registerables);
    }

    title = 'ng2-charts-demo';

    public lineChartData: ChartConfiguration<'line'>['data'] = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [
            {
                data: [90, 100, 110, 120, 150, 110],
                label: 'Workout Times',
                fill: false,
                tension: 0.1,
                borderColor: '#10b981',
                backgroundColor: '#10b981',
            },
        ],
    };
    public lineChartOptions: ChartOptions<'line'> = {
        responsive: true,
    };
    public lineChartLegend = true;

    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //////////////////////////////////////////////

    carouselItems: unknown[] = [
        'https://images.unsplash.com/photo-1533422902779-aff35862e462?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9yaXpvbnRhbHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1598449356475-b9f71db7d847?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://plus.unsplash.com/premium_photo-1661962685099-c6a685e6c61d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9yaXpvbnRhbHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1587387119725-9d6bac0f22fb?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG9yaXpvbnRhbHxlbnwwfHwwfHx8MA%3D%3D',
    ];
    activeIndex: number = 0;

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'ArrowLeft') {
            this.previous();
        }
        if (event.key === 'ArrowRight') {
            this.next();
        }
    }

    previous() {
        if (this.activeIndex === 0) {
            this.activeIndex = this.carouselItems.length - 1;
        } else {
            this.activeIndex--;
        }
    }

    next() {
        if (this.activeIndex === this.carouselItems.length - 1) {
            this.activeIndex = 0;
        } else {
            this.activeIndex++;
        }
    }

    changeSlide(index: number) {
        this.activeIndex = index;
    }
}

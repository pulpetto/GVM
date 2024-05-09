import { Component } from '@angular/core';
import { ChartsCarouselComponent } from '../../charts-carousel/charts-carousel.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-workout-full-view',
    standalone: true,
    templateUrl: './workout-full-view.component.html',
    styleUrl: './workout-full-view.component.css',
    imports: [ChartsCarouselComponent, CommonModule],
})
export class WorkoutFullViewComponent {}

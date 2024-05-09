import { Component } from '@angular/core';
import { ChartsCarouselComponent } from '../../charts-carousel/charts-carousel.component';

@Component({
    selector: 'app-workout-full-view',
    standalone: true,
    templateUrl: './workout-full-view.component.html',
    styleUrl: './workout-full-view.component.css',
    imports: [ChartsCarouselComponent],
})
export class WorkoutFullViewComponent {}

import { Component } from '@angular/core';
import { ChartsCarouselComponent } from '../charts-carousel/charts-carousel.component';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
    selector: 'app-exercise',
    standalone: true,
    templateUrl: './exercise.component.html',
    styleUrl: './exercise.component.css',
    imports: [ChartsCarouselComponent, TabsComponent],
})
export class ExerciseComponent {}

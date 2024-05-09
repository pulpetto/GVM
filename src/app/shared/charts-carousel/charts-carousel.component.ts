import { Component } from '@angular/core';
import { OneOptionModalComponent } from '../one-option-modal/one-option-modal.component';
import { CarouselComponent } from '../carousel/carousel.component';
import { ButtonForModalComponent } from '../button-for-modal/button-for-modal.component';

@Component({
    selector: 'app-charts-carousel',
    standalone: true,
    templateUrl: './charts-carousel.component.html',
    styleUrl: './charts-carousel.component.css',
    imports: [
        OneOptionModalComponent,
        CarouselComponent,
        ButtonForModalComponent,
    ],
})
export class ChartsCarouselComponent {
    handle() {}
}

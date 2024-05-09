import { Component } from '@angular/core';
import { IconButtonComponent } from '../../../shared/icon-button/icon-button.component';
import { CommonModule } from '@angular/common';
import { OneOptionModalComponent } from '../../../shared/one-option-modal/one-option-modal.component';
import { RecentComponent } from './recent/recent.component';
import { ChartsCarouselComponent } from '../../../shared/charts-carousel/charts-carousel.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    imports: [
        IconButtonComponent,
        CommonModule,
        OneOptionModalComponent,
        RecentComponent,
        ChartsCarouselComponent,
    ],
})
export class ProfileComponent {}

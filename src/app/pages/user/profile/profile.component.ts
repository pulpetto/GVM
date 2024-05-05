import { Component } from '@angular/core';
import { IconButtonComponent } from '../../../shared/icon-button/icon-button.component';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import { OneOptionModalComponent } from '../../../shared/one-option-modal/one-option-modal.component';
import { RecentComponent } from './recent/recent.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css',
    imports: [
        IconButtonComponent,
        CommonModule,
        BaseChartDirective,
        OneOptionModalComponent,
        RecentComponent,
    ],
})
export class ProfileComponent {
    modalVisibility: boolean = false;

    chartsModalVisibility: boolean = false;
    chartsPeriodModalVisibility: boolean = false;

    handle() {}

    }
}

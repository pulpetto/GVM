import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
    selector: 'app-workout-summary',
    standalone: true,
    imports: [CommonModule, TabsComponent],
    templateUrl: './workout-summary.component.html',
    styleUrl: './workout-summary.component.css',
})
export class WorkoutSummaryComponent {}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from '../tabs/tabs.component';
import { MotivationalQuotesComponent } from './motivational-quotes/motivational-quotes.component';
import { FeedbackComponent } from './tabs/feedback/feedback.component';
import { ProgressComponent } from './tabs/progress/progress.component';
import { StatisticsComponent } from './tabs/statistics/statistics.component';
@Component({
    selector: 'app-workout-summary',
    standalone: true,
    imports: [
        CommonModule,
        TabsComponent,
        MotivationalQuotesComponent,
        FeedbackComponent,
        ProgressComponent,
        StatisticsComponent,
    ],
    templateUrl: './workout-summary.component.html',
    styleUrl: './workout-summary.component.css',
})
export class WorkoutSummaryComponent {}

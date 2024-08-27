import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from '../tabs/tabs.component';
import { MotivationalQuotesComponent } from './motivational-quotes/motivational-quotes.component';
import { FeedbackComponent } from './tabs/feedback/feedback.component';
import { ProgressComponent } from './tabs/progress/progress.component';
import { StatisticsComponent } from './tabs/statistics/statistics.component';
import { WorkoutCounterComponent } from './workout-counter/workout-counter.component';
import { WorkoutDoneFull } from '../../interfaces/workout/workout-done-full';
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
        WorkoutCounterComponent,
    ],
    templateUrl: './workout-summary.component.html',
    styleUrl: './workout-summary.component.css',
})
export class WorkoutSummaryComponent implements OnInit {
    workoutData!: WorkoutDoneFull;

    ngOnInit() {
        this.workoutData = history.state;
    }
}

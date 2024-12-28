import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from '../tabs/tabs.component';
import { MotivationalQuotesComponent } from './motivational-quotes/motivational-quotes.component';
import { ProgressComponent } from './progress/progress.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { WorkoutDoneFull } from '../../interfaces/workout/workout-done-full';
import { NavbarVisibilityService } from '../../services/navbar-visibility.service';
import { RouterLink, RouterModule } from '@angular/router';
@Component({
    selector: 'app-workout-summary',
    standalone: true,
    imports: [
        CommonModule,
        MotivationalQuotesComponent,
        ProgressComponent,
        StatisticsComponent,
        RouterModule,
    ],
    templateUrl: './workout-summary.component.html',
    styleUrl: './workout-summary.component.css',
})
export class WorkoutSummaryComponent implements OnInit {
    navbarVisibilityService = inject(NavbarVisibilityService);
    cdr = inject(ChangeDetectorRef);

    workoutData!: WorkoutDoneFull;

    ngOnInit() {
        this.workoutData = history.state;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.navbarVisibilityService.visibility.next(false);
        });

        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        this.navbarVisibilityService.visibility.next(true);
    }
}

import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { WorkoutDonePreviewComponent } from '../../../../shared/workoutViews/workout-done-preview/workout-done-preview.component';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WorkoutDoneFull } from '../../../../interfaces/workout/workout-done-full';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../shared/previous-route-button/previous-route-button.component';

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [
        WorkoutDonePreviewComponent,
        CommonModule,
        ActivityBarComponent,
        PreviousRouteButtonComponent,
    ],
    templateUrl: './history.component.html',
    styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
    userService = inject(UserService);
    destroyRef = inject(DestroyRef);

    workouts: WorkoutDoneFull[] = [];
    workoutsCount!: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lastDoc: any;
    limit = 5;

    ngOnInit() {
        this.userService.user$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((user) => {
                if (user) {
                    this.loadWorkouts();

                    this.userService
                        .getDoneWorkoutsCount()
                        .subscribe((data) => {
                            this.workoutsCount = data;
                        });
                }
            });
    }

    loadWorkouts() {
        this.userService
            .getDoneWorkouts(this.limit, this.lastDoc)
            .subscribe((newWorkouts) => {
                this.workouts.push(...newWorkouts);
                this.lastDoc =
                    newWorkouts.length > 0
                        ? newWorkouts[newWorkouts.length - 1]
                        : null;
            });
    }
}

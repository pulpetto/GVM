import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { WorkoutDonePreviewComponent } from '../../../../shared/workoutViews/workout-done-preview/workout-done-preview.component';
import { UserService } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WorkoutDoneWithId } from '../../../../interfaces/workout/workout-done-with-id';

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [WorkoutDonePreviewComponent, CommonModule],
    templateUrl: './history.component.html',
    styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
    userService = inject(UserService);
    destroyRef = inject(DestroyRef);

    workouts: WorkoutDoneWithId[] = [];
    workoutsCount!: number;
    lastDoc: any;
    limit = 3;

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

    loadWorkouts(): void {
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

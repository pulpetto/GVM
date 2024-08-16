import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { WorkoutDonePreviewComponent } from '../../../../shared/workoutViews/workout-done-preview/workout-done-preview.component';
import { UserService } from '../../../../services/user.service';
import { Observable } from 'rxjs';
import { WorkoutDone } from '../../../../interfaces/workout/workout-done';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

    workoutsData$!: Observable<WorkoutDone[]>;

    ngOnInit() {
        this.userService.user$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((user) => {
                if (user) {
                    this.workoutsData$ = this.userService.getDoneWorkouts();
                }
            });
    }
}

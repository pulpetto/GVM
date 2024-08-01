import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ChartsCarouselComponent } from '../../charts-carousel/charts-carousel.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';
import { Workout } from '../../../interfaces/workout/workout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-workout-full-view',
    standalone: true,
    templateUrl: './workout-full-view.component.html',
    styleUrl: './workout-full-view.component.css',
    imports: [ChartsCarouselComponent, CommonModule],
})
export class WorkoutFullViewComponent implements OnInit {
    workoutId!: string;
    workoutData$!: Observable<Workout>;

    destroyRef = inject(DestroyRef);

    constructor(
        private route: ActivatedRoute,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.route.paramMap
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((params) => {
                this.workoutId = params.get('id')!;
            });

        this.userService.user$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((user) => {
                if (user && this.workoutId) {
                    this.workoutData$ = this.userService.getWorkoutById(
                        this.workoutId
                    );
                }
            });
    }
}

import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { TimeFormatterPipe } from '../../../pipes/time-formatter.pipe';
import { DataService } from '../../../services/data.service';
import { Exercise } from '../../../interfaces/exercise';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WorkoutDoneWithId } from '../../../interfaces/workout/workout-done-with-id';

@Component({
    selector: 'app-workout-done-preview',
    standalone: true,
    imports: [TimeFormatterPipe, RouterModule],
    templateUrl: './workout-done-preview.component.html',
    styleUrl: './workout-done-preview.component.css',
})
export class WorkoutDonePreviewComponent implements OnInit {
    @Input({ required: true }) workoutData!: WorkoutDoneWithId;

    dataService = inject(DataService);
    destroyRef = inject(DestroyRef);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);

    exercisesData: Exercise[] = [];

    ngOnInit() {
        this.workoutData.exercises.forEach((exercise) => {
            this.dataService
                .getExerciseById(exercise.exerciseId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((data) => this.exercisesData.push(data!));
        });
    }

    navigateToFullView() {
        this.router.navigate([this.workoutData.id], {
            relativeTo: this.activatedRoute,
            state: this.workoutData,
        });
    }
}

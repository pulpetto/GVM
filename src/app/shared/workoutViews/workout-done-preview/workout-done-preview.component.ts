import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { WorkoutDone } from '../../../interfaces/workout/workout-done';
import { TimeFormatterPipe } from '../../../pipes/time-formatter.pipe';
import { DataService } from '../../../services/data.service';
import { Exercise } from '../../../interfaces/exercise';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-workout-done-preview',
    standalone: true,
    imports: [TimeFormatterPipe],
    templateUrl: './workout-done-preview.component.html',
    styleUrl: './workout-done-preview.component.css',
})
export class WorkoutDonePreviewComponent implements OnInit {
    @Input({ required: true }) workoutData!: WorkoutDone;

    dataService = inject(DataService);
    destroyRef = inject(DestroyRef);

    exercisesData: Exercise[] = [];

    ngOnInit() {
        this.workoutData.exercises.forEach((exercise) => {
            this.dataService
                .getExerciseById(exercise.exerciseId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((data) => this.exercisesData.push(data!));
        });
    }
}

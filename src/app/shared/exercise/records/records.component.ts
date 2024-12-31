import { Component, Input, OnInit } from '@angular/core';
import { WorkoutDoneWithId } from '../../../interfaces/workout/workout-done-with-id';

@Component({
    selector: 'app-records',
    standalone: true,
    imports: [],
    templateUrl: './records.component.html',
    styleUrl: './records.component.css',
})
export class RecordsComponent implements OnInit {
    @Input({ required: true }) workouts!: WorkoutDoneWithId[];
    @Input({ required: true }) exerciseId!: string;

    heaviestWeight: number = 0;
    highestVolume: number = 0;
    highestVolumeWeight: number = 0;
    highestVolumeReps: number = 0;
    mostReps: number = 0;
    mostReppedWeight: number = 0;

    ngOnInit() {
        this.workouts.forEach((workout) => {
            const exercise = workout.exercises.find(
                (exercise) => exercise.exerciseId === this.exerciseId
            );

            exercise!.sets.forEach((set) => {
                if (+set.weight > this.heaviestWeight) {
                    this.heaviestWeight = +set.weight;
                }

                if (+set.weight * +set.reps > this.highestVolume) {
                    this.highestVolume = +set.weight * +set.reps;
                    this.highestVolumeWeight = +set.weight;
                    this.highestVolumeReps = +set.reps;
                }

                if (+set.reps >= this.mostReps) {
                    this.mostReps = +set.reps;
                    this.mostReppedWeight = +set.weight;
                }
            });
        });
    }
}

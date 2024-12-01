import { Component, inject, Input } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { WorkoutDoneFull } from '../../../../interfaces/workout/workout-done-full';
import { filter, map, Observable, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CurrentGoal } from '../../../../interfaces/goals/current-goal';
import { GoalComponent } from '../../../../pages/user/profile/goals/goal/goal.component';

@Component({
    selector: 'app-progress',
    standalone: true,
    imports: [CommonModule, GoalComponent],
    templateUrl: './progress.component.html',
    styleUrl: './progress.component.css',
})
export class ProgressComponent {
    workoutData!: WorkoutDoneFull;

    @Input({ required: true }) set workout(workoutDataInput: WorkoutDoneFull) {
        const exercisesIds: string[] = [];

        workoutDataInput.exercises.forEach((exercise) =>
            exercisesIds.push(exercise.exerciseId)
        );

        this.goals$ = this.userService.user$.pipe(
            filter((user) => !!user),
            switchMap(() =>
                this.userService.getGoalsForExercises(exercisesIds).pipe(
                    map((goals) =>
                        goals.map((goal) => ({
                            id: goal.id,
                            current1rm: this.calculateEstimated1rm(
                                workoutDataInput,
                                goal.exerciseId
                            ),
                            goal1rm: goal.targetWeight,
                            percentageProgress: Math.round(
                                (this.calculateEstimated1rm(
                                    workoutDataInput,
                                    goal.exerciseId
                                ) /
                                    goal.targetWeight) *
                                    100
                            ),
                            exerciseData: workoutDataInput.exercises.find(
                                (exercise) =>
                                    exercise.exerciseId === goal.exerciseId
                            )!.staticData!,
                        }))
                    )
                )
            )
        );
    }

    calculateEstimated1rm(
        workout: WorkoutDoneFull,
        exerciseId: string
    ): number {
        let estimated1rm = 0;

        const exercise = workout.exercises.find(
            (exercise) => exercise.exerciseId === exerciseId
        );

        let heaviestWeight = 0;
        let reps = 0;

        exercise!.sets.forEach((set) => {
            if (+set.weight > heaviestWeight) {
                heaviestWeight = +set.weight;
                reps = +set.reps;
            }
        });

        const oneRm = Math.round(heaviestWeight * (1 + 0.0333 * reps));
        if (oneRm > estimated1rm) {
            estimated1rm = oneRm;
        }

        return estimated1rm;
    }

    userService = inject(UserService);

    goals$: Observable<CurrentGoal[]> | undefined;
}

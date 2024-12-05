import { Component, inject, OnInit } from '@angular/core';
import { AchievementComponent } from '../../../../shared/achievement/achievement.component';
import { DataService } from '../../../../services/data.service';
import { filter, Observable, switchMap } from 'rxjs';
import { Achievement } from '../../../../interfaces/achievement';
import { CommonModule } from '@angular/common';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../shared/previous-route-button/previous-route-button.component';
import { UserService } from '../../../../services/user.service';

interface AchievementsTypes {
    [key: string]: number;
    totalWorkoutDuration: number;
    workoutsAmount: number; //
    totalWorkoutsVolume: number; //
    totalWorkoutsReps: number; //
    totalWorkoutsSets: number; //
    workoutsOver2Hours: number;
    workoutsOver20kVolume: number;
    workoutsOver100Reps: number;
    workoutsOver20Sets: number;
    estimatedSquat1rm: number;
    estimatedBench1rm: number;
    estimatedDeadlift1rm: number; //
    powerliftingTotal: number; //
}

@Component({
    selector: 'app-achievements',
    standalone: true,
    imports: [
        AchievementComponent,
        CommonModule,
        ActivityBarComponent,
        PreviousRouteButtonComponent,
    ],
    templateUrl: './achievements.component.html',
    styleUrl: './achievements.component.css',
})
export class AchievementsComponent implements OnInit {
    dataService = inject(DataService);
    userService = inject(UserService);

    achievements$!: Observable<Achievement[]>;

    achievementsValues: AchievementsTypes = {
        totalWorkoutDuration: 0,
        workoutsAmount: 0,
        totalWorkoutsVolume: 0,
        totalWorkoutsReps: 0,
        totalWorkoutsSets: 0,
        workoutsOver2Hours: 0,
        workoutsOver20kVolume: 0,
        workoutsOver100Reps: 0,
        workoutsOver20Sets: 0,
        estimatedSquat1rm: 0,
        estimatedBench1rm: 0,
        estimatedDeadlift1rm: 0,
        powerliftingTotal: 0,
    };

    loading: boolean = true;

    ngOnInit() {
        this.achievements$ = this.dataService.getAchievements$();

        this.userService.user$
            .pipe(
                filter((user) => !!user),
                switchMap(() => this.userService.getAllDoneWorkouts())
            )
            .subscribe((workouts) => {
                workouts.forEach((workout) => {
                    let repsInWorkout = 0;
                    let setsInWorkout = 0;

                    this.achievementsValues.totalWorkoutDuration +=
                        workout.duration;

                    workout.exercises.forEach((exercise) => {
                        exercise.sets.forEach((set) => {
                            if (set.isDone) {
                                this.achievementsValues.totalWorkoutsVolume +=
                                    set.reps * set.weight;

                                this.achievementsValues.totalWorkoutsReps +=
                                    +set.reps;
                                repsInWorkout += set.reps;

                                this.achievementsValues.totalWorkoutsSets++;
                                setsInWorkout++;
                            }
                        });

                        if (
                            exercise.exerciseId === '59wzXlkwNom13oL3OiNM' ||
                            exercise.exerciseId === 'SdMfU5CvUwSBdl9jgp3M' ||
                            exercise.exerciseId === '0Jd1ahlkGgsNzexbdzVU'
                        ) {
                            let heaviestWeight = 0;
                            let reps = 0;

                            exercise!.sets.forEach((set) => {
                                if (+set.weight > heaviestWeight) {
                                    heaviestWeight = +set.weight;
                                    reps = +set.reps;
                                }
                            });

                            const oneRm = Math.round(
                                heaviestWeight * (1 + 0.0333 * reps)
                            );

                            if (exercise.exerciseId === '59wzXlkwNom13oL3OiNM')
                                if (
                                    oneRm >
                                    this.achievementsValues.estimatedSquat1rm
                                )
                                    this.achievementsValues.estimatedSquat1rm =
                                        oneRm;

                            if (exercise.exerciseId === 'SdMfU5CvUwSBdl9jgp3M')
                                if (
                                    oneRm >
                                    this.achievementsValues.estimatedBench1rm
                                )
                                    this.achievementsValues.estimatedBench1rm =
                                        oneRm;

                            if (exercise.exerciseId === '0Jd1ahlkGgsNzexbdzVU')
                                if (
                                    oneRm >
                                    this.achievementsValues.estimatedDeadlift1rm
                                )
                                    this.achievementsValues.estimatedDeadlift1rm =
                                        oneRm;
                        }
                    });

                    if (workout.duration >= 7200)
                        this.achievementsValues.workoutsOver2Hours++;
                    if (workout.volume >= 20000)
                        this.achievementsValues.workoutsOver20kVolume++;
                    if (repsInWorkout > 100)
                        this.achievementsValues.workoutsOver100Reps++;
                    if (setsInWorkout > 20)
                        this.achievementsValues.workoutsOver20Sets++;
                });

                this.achievementsValues.powerliftingTotal =
                    this.achievementsValues.estimatedSquat1rm +
                    this.achievementsValues.estimatedBench1rm +
                    this.achievementsValues.estimatedDeadlift1rm;

                this.achievementsValues.workoutsAmount = workouts.length;

                this.loading = false;
            });
    }
}

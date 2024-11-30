import { Component, inject, Input, OnInit } from '@angular/core';
import { WorkoutDoneFull } from '../../../../interfaces/workout/workout-done-full';
import { TimeFormatterPipe } from '../../../../pipes/time-formatter.pipe';
import { NumberSeparatorPipe } from '../../../../pipes/number-separator.pipe';
import { DataService } from '../../../../services/data.service';
import {
    BehaviorSubject,
    forkJoin,
    map,
    Observable,
    of,
    switchMap,
} from 'rxjs';
import { CommonModule } from '@angular/common';

interface MuscleGroupsSetsDistribution {
    [id: string]: {
        name: string;
        imgPreviewUrl: string;
        mainSets: number;
        mainPercentage: number;
        secondarySets: number;
        secondaryPercentage: number;
    };
}

@Component({
    selector: 'app-statistics',
    standalone: true,
    imports: [TimeFormatterPipe, NumberSeparatorPipe, CommonModule],
    templateUrl: './statistics.component.html',
    styleUrl: './statistics.component.css',
})
export class StatisticsComponent implements OnInit {
    @Input() set workoutDataInput(workout: WorkoutDoneFull) {
        this.workoutData = workout;
        this.workoutSubject.next(workout);
    }

    dataService = inject(DataService);

    workoutSubject = new BehaviorSubject<WorkoutDoneFull | null>(null);

    muscleGroupsDistribution$!: Observable<MuscleGroupsSetsDistribution>;

    workoutData!: WorkoutDoneFull;

    ngOnInit() {
        this.muscleGroupsDistribution$ = this.workoutSubject.pipe(
            switchMap((workout) => {
                if (!workout) return of({} as MuscleGroupsSetsDistribution);

                const muscleGroupIds = new Set<string>();
                const distributionMap: MuscleGroupsSetsDistribution = {};

                workout.exercises.forEach((exercise) => {
                    exercise.staticData.mainMuscleGroupsIds.forEach((id) => {
                        muscleGroupIds.add(id);
                        exercise.sets.forEach((set) => {
                            if (set.isDone) {
                                distributionMap[id] = distributionMap[id] || {
                                    name: '',
                                    imgUrl: '',
                                    mainSets: 0,
                                    secondarySets: 0,
                                };
                                distributionMap[id].mainSets++;
                            }
                        });
                    });

                    exercise.staticData.secondaryMuscleGroupsIds.forEach(
                        (id) => {
                            muscleGroupIds.add(id);
                            exercise.sets.forEach((set) => {
                                if (set.isDone) {
                                    distributionMap[id] = distributionMap[
                                        id
                                    ] || {
                                        name: '',
                                        imgUrl: '',
                                        mainSets: 0,
                                        secondarySets: 0,
                                    };
                                    distributionMap[id].secondarySets++;
                                }
                            });
                        }
                    );
                });

                Object.entries(distributionMap).forEach((muscleGroup) => {
                    const totalSets =
                        muscleGroup[1].mainSets + muscleGroup[1].secondarySets;

                    muscleGroup[1].mainPercentage = Math.round(
                        (muscleGroup[1].mainSets / totalSets) * 100
                    );

                    muscleGroup[1].secondaryPercentage = Math.round(
                        (muscleGroup[1].secondarySets / totalSets) * 100
                    );
                });

                const muscleGroupObservables = Array.from(muscleGroupIds).map(
                    (id) => this.dataService.getMuscleGroup$(id)
                );

                return forkJoin(muscleGroupObservables).pipe(
                    map((muscleGroups) => {
                        muscleGroups.forEach((group) => {
                            if (distributionMap[group.id]) {
                                distributionMap[group.id].name = group.name;
                                distributionMap[group.id].imgPreviewUrl =
                                    group.imagePreviewUrl;
                            }
                        });

                        return distributionMap;
                    })
                );
            })
        );
    }
}

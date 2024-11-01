import { Component, inject, OnInit } from '@angular/core';
import { ChartsCarouselComponent } from '../charts-carousel/charts-carousel.component';
import { TabsComponent } from '../tabs/tabs.component';
import { InstructionComponent } from './instruction/instruction.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import {
    combineLatest,
    filter,
    forkJoin,
    map,
    Observable,
    switchMap,
} from 'rxjs';
import { ExerciseDetails } from '../../interfaces/exercise-details';
import { UserService } from '../../services/user.service';
import { WorkoutDoneWithId } from '../../interfaces/workout/workout-done-with-id';
import { FullDatePipe } from '../../pipes/full-date.pipe';
import { ExercisePreviewFull } from '../../interfaces/exercise-preview-full';
import { ExerciseChartsComponent } from './exercise-charts/exercise-charts.component';
import { RecordsComponent } from './records/records.component';

@Component({
    selector: 'app-exercise',
    standalone: true,
    templateUrl: './exercise.component.html',
    styleUrl: './exercise.component.css',
    imports: [
        ChartsCarouselComponent,
        TabsComponent,
        InstructionComponent,
        RouterModule,
        CommonModule,
        FullDatePipe,
        ExerciseChartsComponent,
        RecordsComponent,
    ],
})
export class ExerciseComponent implements OnInit {
    dataService = inject(DataService);
    userService = inject(UserService);
    activatedRoute = inject(ActivatedRoute);

    combinedExerciseData$!: Observable<{
        baseData: ExercisePreviewFull;
        detailsData: ExerciseDetails;
        workoutsWithExercise: WorkoutDoneWithId[];
    }>;

    exerciseId!: string | null;

    ngOnInit() {
        this.exerciseId = this.activatedRoute.snapshot.paramMap.get('id');

        this.combinedExerciseData$ = this.userService.user$.pipe(
            filter((user) => !!user),
            switchMap(() =>
                combineLatest([
                    this.dataService.getExercisePreview$(this.exerciseId!).pipe(
                        switchMap((exerciseObj) => {
                            const mainMuscleGroups$ = forkJoin(
                                exerciseObj.mainMuscleGroupsIds.map((id) =>
                                    this.dataService.getMuscleGroup$(id)
                                )
                            );

                            const secondaryMuscleGroups$ = forkJoin(
                                exerciseObj.secondaryMuscleGroupsIds.map((id) =>
                                    this.dataService.getMuscleGroup$(id)
                                )
                            );

                            const equipment$ =
                                this.dataService.getEquipmentById$(
                                    exerciseObj.equipmentId
                                );

                            return forkJoin([
                                mainMuscleGroups$,
                                secondaryMuscleGroups$,
                                equipment$,
                            ]).pipe(
                                map(
                                    ([
                                        mainMuscleGroups,
                                        secondaryMuscleGroups,
                                        equipment,
                                    ]) => ({
                                        ...exerciseObj,
                                        mainMuscleGroups: mainMuscleGroups,
                                        secondaryMuscleGroups:
                                            secondaryMuscleGroups,
                                        equipment: equipment,
                                    })
                                )
                            );
                        })
                    ),
                    this.dataService.getExerciseDetails$(this.exerciseId!),
                    this.userService.getDoneWorkoutsByExerciseId(
                        this.exerciseId!
                    ),
                ]).pipe(
                    map(([baseData, detailsData, workoutsWithExercise]) => ({
                        baseData,
                        detailsData,
                        workoutsWithExercise,
                    }))
                )
            )
        );
    }
}

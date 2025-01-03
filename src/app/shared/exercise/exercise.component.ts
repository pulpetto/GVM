import { Component, inject, OnInit } from '@angular/core';
import { TabsComponent } from '../tabs/tabs.component';
import { InstructionComponent } from './instruction/instruction.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
import { ActivityBarComponent } from '../activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../previous-route-button/previous-route-button.component';
import { ExercisePreview } from '../../interfaces/exercise-preview';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-exercise',
    standalone: true,
    templateUrl: './exercise.component.html',
    styleUrl: './exercise.component.css',
    imports: [
        TabsComponent,
        InstructionComponent,
        RouterModule,
        CommonModule,
        FullDatePipe,
        ExerciseChartsComponent,
        RecordsComponent,
        ActivityBarComponent,
        PreviousRouteButtonComponent,
        LoadingSpinnerComponent,
    ],
})
export class ExerciseComponent implements OnInit {
    dataService = inject(DataService);
    userService = inject(UserService);
    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);

    combinedExerciseData$!: Observable<{
        baseData: ExercisePreviewFull;
        detailsData: ExerciseDetails;
        workoutsWithExercise: WorkoutDoneWithId[];
    }>;

    exerciseId!: string | null;

    ngOnInit() {
        this.exerciseId = this.activatedRoute.snapshot.paramMap.get('id');
        const custom = this.activatedRoute.snapshot.queryParamMap.get('custom');

        if (custom === 'false') {
            this.combinedExerciseData$ = this.userService.user$.pipe(
                filter((user) => !!user),
                switchMap(() =>
                    combineLatest([
                        this.dataService
                            .getExercisePreview$(this.exerciseId!)
                            .pipe(this.exerciseBaseData),
                        this.dataService.getExerciseDetails$(this.exerciseId!),
                        this.userService.getDoneWorkoutsByExerciseId(
                            this.exerciseId!
                        ),
                    ]).pipe(
                        map(
                            ([
                                baseData,
                                detailsData,
                                workoutsWithExercise,
                            ]) => ({
                                baseData,
                                detailsData,
                                workoutsWithExercise,
                            })
                        )
                    )
                )
            );
        } else if (custom === 'true') {
            this.combinedExerciseData$ = this.userService.user$.pipe(
                filter((user) => !!user),
                switchMap(() =>
                    combineLatest([
                        this.userService
                            .getCustomExercisePreviewById(this.exerciseId!)
                            .pipe(this.exerciseBaseData),
                        this.userService.getCustomExerciseDetailsById(
                            this.exerciseId!
                        ),
                        this.userService.getDoneWorkoutsByExerciseId(
                            this.exerciseId!
                        ),
                    ]).pipe(
                        map(
                            ([
                                baseData,
                                detailsData,
                                workoutsWithExercise,
                            ]) => ({
                                baseData,
                                detailsData,
                                workoutsWithExercise,
                            })
                        )
                    )
                )
            );
        }
    }

    exerciseBaseData = switchMap((exerciseObj: ExercisePreview) => {
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

        const equipment$ = this.dataService.getEquipmentById$(
            exerciseObj.equipmentId
        );

        return forkJoin([
            mainMuscleGroups$,
            secondaryMuscleGroups$,
            equipment$,
        ]).pipe(
            map(([mainMuscleGroups, secondaryMuscleGroups, equipment]) => ({
                ...exerciseObj,
                mainMuscleGroups: mainMuscleGroups,
                secondaryMuscleGroups: secondaryMuscleGroups,
                equipment: equipment,
            }))
        );
    });

    redirectToExerciseEditor(
        baseData: ExercisePreviewFull,
        exetendedData: ExerciseDetails
    ) {
        this.router.navigate(['edit'], {
            relativeTo: this.activatedRoute,
            state: { previewData: { baseData, exetendedData } },
        });
    }
}

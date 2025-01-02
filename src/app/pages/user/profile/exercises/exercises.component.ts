import {
    Component,
    DestroyRef,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MuscleGroupsModalComponent } from '../../../../shared/modals/muscle-groups-modal/muscle-groups-modal.component';
import { EquipmentModalComponent } from '../../../../shared/modals/equipment-modal/equipment-modal.component';
import { DataService } from '../../../../services/data.service';
import { FormsModule } from '@angular/forms';
import { ExercisePreview } from '../../../../interfaces/exercise-preview';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../shared/previous-route-button/previous-route-button.component';
import { UserService } from '../../../../services/user.service';
import { filter, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-exercises',
    standalone: true,
    templateUrl: './exercises.component.html',
    styleUrl: './exercises.component.css',
    imports: [
        CommonModule,
        RouterModule,
        MuscleGroupsModalComponent,
        EquipmentModalComponent,
        FormsModule,
        RouterModule,
        ActivityBarComponent,
        PreviousRouteButtonComponent,
    ],
})
export class ExercisesComponent implements OnInit {
    dataService = inject(DataService);
    userService = inject(UserService);
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    destroyRef = inject(DestroyRef);

    exercisesModalVisibility: boolean = false;
    innerModalsVisibility: boolean = false;

    exercises: ExercisePreview[] | null = null;
    exercisesFiltered: ExercisePreview[] = [];
    newlySelectedExercisesIds = new Set<number>();

    @ViewChild(MuscleGroupsModalComponent)
    muscleGroupsModalComponent!: MuscleGroupsModalComponent;

    @ViewChild(EquipmentModalComponent)
    equipmentModalComponent!: EquipmentModalComponent;

    searchTerm: string = '';

    selectedMuscleGroupId: string | null = null;

    selectedEquipmentId: string | null = null;

    ngOnInit() {
        this.dataService
            .getExercisesPreviews$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((data) => {
                this.exercises = data;
                this.exercisesFiltered = data;
            });

        this.userService.user$
            .pipe(
                filter((user) => !!user),
                switchMap(() => this.userService.getCustomExercisesPreviews()),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((data) =>
                data.forEach((customExercise) =>
                    this.exercises?.push(customExercise)
                )
            );
    }

    openExercisesModal() {
        this.newlySelectedExercisesIds.clear();
        this.exercisesModalVisibility = true;
    }

    closeExercisesModal() {
        this.exercisesModalVisibility = false;
    }

    filterExercisesByMusclesNames(id: string | null) {
        this.selectedMuscleGroupId = id;
        this.applyFilters();
    }

    filterExercisesByEquipment(id: string | null) {
        this.selectedEquipmentId = id;
        this.applyFilters();
    }

    applyFilters() {
        let filtered = this.exercises;

        if (this.searchTerm) {
            filtered = filtered!.filter((exercise) =>
                exercise.name
                    .toLowerCase()
                    .startsWith(this.searchTerm.toLowerCase())
            );
        }

        if (this.selectedMuscleGroupId) {
            filtered = filtered!.filter((exercise) =>
                exercise.mainMuscleGroupsIds.includes(
                    this.selectedMuscleGroupId!
                )
            );
        }

        if (this.selectedEquipmentId) {
            filtered = filtered!.filter(
                (exercise) => exercise.equipmentId === this.selectedEquipmentId
            );
        }

        this.exercisesFiltered = filtered!;
    }

    clearFilters() {
        this.muscleGroupsModalComponent.reset();
        this.selectedMuscleGroupId = null;

        this.equipmentModalComponent.reset();
        this.selectedEquipmentId = null;

        this.applyFilters();
    }

    navigateToExercisePage(id: string, custom: boolean) {
        this.router.navigate([id], {
            relativeTo: this.activatedRoute,
            queryParams: { custom: custom },
        });
    }
}

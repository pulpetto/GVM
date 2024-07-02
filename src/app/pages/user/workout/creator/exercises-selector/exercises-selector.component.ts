import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MuscleGroupsModalComponent } from '../../../../../shared/modals/muscle-groups-modal/muscle-groups-modal.component';
import { EquipmentModalComponent } from '../../../../../shared/modals/equipment-modal/equipment-modal.component';
import { Exercise } from '../../../../../interfaces/exercise';
import { DataService } from '../../../../../services/data.service';

@Component({
    selector: 'app-exercises-selector',
    standalone: true,
    templateUrl: './exercises-selector.component.html',
    styleUrl: './exercises-selector.component.css',
    imports: [
        CommonModule,
        FormsModule,
        MuscleGroupsModalComponent,
        EquipmentModalComponent,
    ],
})
export class ExercisesSelectorComponent implements OnInit {
    dataService = inject(DataService);

    exercisesModalVisibility: boolean = false;
    innerModalsVisibility: boolean = false;

    exercises!: Exercise[];
    selectedExercisesIds = new Set<number>();
    newlySelectedExercisesIds = new Set<number>();

    ngOnInit() {
        this.dataService.getExercises().subscribe((data) => {
            this.exercises = data;
        });
    }

    onExerciseSelect($index: number) {
        if (this.newlySelectedExercisesIds.has($index + 1)) {
            this.newlySelectedExercisesIds.delete($index + 1);
        } else {
            this.newlySelectedExercisesIds.add($index + 1);
        }
    }

    addExercises() {
        this.newlySelectedExercisesIds.forEach((value) =>
            this.selectedExercisesIds.add(value)
        );

        this.closeExercisesModal();
    }

    openExercisesModal() {
        this.newlySelectedExercisesIds.clear();
        this.exercisesModalVisibility = true;
    }

    closeExercisesModal() {
        this.exercisesModalVisibility = false;
    }

    searchTerm: string = '';

    onExerciseSearch() {
        this.exercises = this.exercises.filter((exercise) =>
            exercise.name
                .toLowerCase()
                .startsWith(this.searchTerm.toLowerCase())
        );
    }
}

import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { InputComponent } from '../../../../shared/input/input.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MuscleGroupsModalComponent } from '../../../../shared/modals/muscle-groups-modal/muscle-groups-modal.component';
import { EquipmentModalComponent } from '../../../../shared/modals/equipment-modal/equipment-modal.component';
import { DataService } from '../../../../services/data.service';
import { MuscleGroupName } from '../../../../types/muscle-group-type';
import { EquipmentName } from '../../../../types/equipment-type';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-exercises',
    standalone: true,
    templateUrl: './exercises.component.html',
    styleUrl: './exercises.component.css',
    imports: [
        InputComponent,
        CommonModule,
        RouterModule,
        MuscleGroupsModalComponent,
        EquipmentModalComponent,
        FormsModule,
        RouterModule,
    ],
})
export class ExercisesComponent implements OnInit {
    dataService = inject(DataService);

    exercisesModalVisibility: boolean = false;
    innerModalsVisibility: boolean = false;

    exercises!: {
        id: number;
        name: string;
        imageUrl: string;
        muscleGroups: MuscleGroupName[];
        equipment: EquipmentName;
    }[];
    exercisesFiltered: {
        id: number;
        name: string;
        imageUrl: string;
        muscleGroups: MuscleGroupName[];
        equipment: EquipmentName;
    }[] = [];
    newlySelectedExercisesIds = new Set<number>();

    @ViewChild(MuscleGroupsModalComponent)
    muscleGroupsModalComponent!: MuscleGroupsModalComponent;

    @ViewChild(EquipmentModalComponent)
    equipmentModalComponent!: EquipmentModalComponent;

    searchTerm: string = '';

    selectedMuscleGroup: MuscleGroupName = 'all muscles';
    selectedMuscleGroupId: number = 1;

    selectedEquipment: EquipmentName = 'all equipment';
    selectedEquipmentId: number = 1;

    ngOnInit() {
        this.dataService.getExercises().subscribe((data) => {
            this.exercises = data;
            this.exercisesFiltered = data;
        });
    }

    openExercisesModal() {
        this.newlySelectedExercisesIds.clear();
        this.exercisesModalVisibility = true;
    }

    closeExercisesModal() {
        this.exercisesModalVisibility = false;
    }

    filterExercisesByMusclesNames(name: MuscleGroupName) {
        this.selectedMuscleGroup = name;
        this.applyFilters();
    }

    filterExercisesByEquipment(name: EquipmentName) {
        this.selectedEquipment = name;
        this.applyFilters();
    }

    applyFilters() {
        let filtered = this.exercises;

        if (this.searchTerm) {
            filtered = filtered.filter((exercise) =>
                exercise.name
                    .toLowerCase()
                    .startsWith(this.searchTerm.toLowerCase())
            );
        }

        if (this.selectedMuscleGroup !== 'all muscles') {
            filtered = filtered.filter((exercise) =>
                exercise.muscleGroups.includes(this.selectedMuscleGroup)
            );
        }

        if (this.selectedEquipment !== 'all equipment') {
            filtered = filtered.filter(
                (exercise) => exercise.equipment === this.selectedEquipment
            );
        }

        this.exercisesFiltered = filtered;
    }

    clearFilters() {
        this.muscleGroupsModalComponent.selectedMuscleGroupName = 'all muscles';
        this.muscleGroupsModalComponent.selectedMuscleGroupId = 1;
        this.selectedMuscleGroup = 'all muscles';
        this.selectedMuscleGroupId = 1;

        this.equipmentModalComponent.selectedEquipmentName = 'all equipment';
        this.equipmentModalComponent.selectedEquipmentId = 1;
        this.selectedEquipment = 'all equipment';
        this.selectedEquipmentId = 1;

        this.applyFilters();
    }
}

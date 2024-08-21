import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MuscleGroupsModalComponent } from '../../../modals/muscle-groups-modal/muscle-groups-modal.component';
import { EquipmentModalComponent } from '../../../modals/equipment-modal/equipment-modal.component';
import { Exercise } from '../../../../interfaces/exercise';
import { DataService } from '../../../../services/data.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { MuscleGroupName } from '../../../../types/muscle-group-type';
import { EquipmentName } from '../../../../types/equipment-type';

const visibleModal = { top: '25%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

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
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style(hiddenModal),
                animate(timing, style(visibleModal)),
            ]),
            transition(':leave', [
                style(visibleModal),
                animate(timing, style(hiddenModal)),
            ]),
        ]),
        trigger('openClose2', [
            transition(':enter', [
                style(hiddenBg),
                animate(timing, style(visibleBg)),
            ]),
            transition(':leave', [
                style(visibleBg),
                animate(timing, style(hiddenBg)),
            ]),
        ]),
        trigger('openClose3', [
            transition(':enter', [
                style(hiddenBtnFixed),
                animate(timing, style(visibleBtnFixed)),
            ]),
            transition(':leave', [
                style(visibleBtnFixed),
                animate(timing, style(hiddenBtnFixed)),
            ]),
        ]),
    ],
})
export class ExercisesSelectorComponent implements OnInit {
    @Input({ required: true }) selectedExercisesIds!: Set<number>;
    @Output() exercisesSelectEvent = new EventEmitter<Set<number>>();

    dataService = inject(DataService);

    exercisesModalVisibility: boolean = false;
    innerModalsVisibility: boolean = false;

    exercises!: Exercise[];
    exercisesFiltered: Exercise[] = [];
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

    onExerciseSelect($index: number) {
        if (this.newlySelectedExercisesIds.has($index + 1)) {
            this.newlySelectedExercisesIds.delete($index + 1);
        } else {
            this.newlySelectedExercisesIds.add($index + 1);
        }
    }

    addExercises() {
        if (this.newlySelectedExercisesIds.size > 0) {
            this.newlySelectedExercisesIds.forEach((value) =>
                this.selectedExercisesIds.add(value)
            );

            this.exercisesSelectEvent.emit(this.newlySelectedExercisesIds);
        }

        this.closeExercisesModal();
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

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
import { DataService } from '../../../../services/data.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ExercisePreview } from '../../../../interfaces/exercise-preview';

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
    @Input({ required: true }) selectedExercisesIds!: Set<string>;
    @Output() exercisesSelectEvent = new EventEmitter<Set<string>>();

    dataService = inject(DataService);

    exercisesModalVisibility: boolean = false;
    innerModalsVisibility: boolean = false;

    exercises: ExercisePreview[] | null = null;
    exercisesFiltered: ExercisePreview[] = [];
    newlySelectedExercisesIds = new Set<string>();

    @ViewChild(MuscleGroupsModalComponent)
    muscleGroupsModalComponent!: MuscleGroupsModalComponent;

    @ViewChild(EquipmentModalComponent)
    equipmentModalComponent!: EquipmentModalComponent;

    searchTerm: string = '';

    selectedMuscleGroupId: string | null = null;

    selectedEquipmentId: string | null = null;

    ngOnInit() {
        this.dataService.getExercisesPreviews$().subscribe((data) => {
            this.exercises = data;
            this.exercisesFiltered = data;
        });
    }

    onExerciseSelect(id: string) {
        if (this.newlySelectedExercisesIds.has(id)) {
            this.newlySelectedExercisesIds.delete(id);
        } else {
            this.newlySelectedExercisesIds.add(id);
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
}

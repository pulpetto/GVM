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
import { MuscleGroupsModalComponent } from '../../../../../../shared/modals/muscle-groups-modal/muscle-groups-modal.component';
import { EquipmentModalComponent } from '../../../../../../shared/modals/equipment-modal/equipment-modal.component';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../../../../../services/data.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { ExercisePreview } from '../../../../../../interfaces/exercise-preview';

const visibleModal = { top: '25%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-exercise-selector',
    standalone: true,
    imports: [
        CommonModule,
        MuscleGroupsModalComponent,
        EquipmentModalComponent,
        FormsModule,
    ],
    templateUrl: './exercise-selector.component.html',
    styleUrl: './exercise-selector.component.css',
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
export class ExerciseSelectorComponent implements OnInit {
    dataService = inject(DataService);

    @Output() exerciseChangeEvent = new EventEmitter<ExercisePreview>();
    @Output() exercisesModalCloseEvent = new EventEmitter<void>();

    @ViewChild(MuscleGroupsModalComponent)
    muscleGroupsModalComponent!: MuscleGroupsModalComponent;

    @ViewChild(EquipmentModalComponent)
    equipmentModalComponent!: EquipmentModalComponent;

    @Input({ required: true }) exercisesModalVisibility!: boolean;
    @Input({ required: true }) modalTitle!: string;
    innerModalsVisibility: boolean = false;

    exercises: ExercisePreview[] | null = null;
    exercisesFiltered: ExercisePreview[] = [];

    searchTerm: string = '';

    selectedMuscleGroupId: string | null = null;

    selectedEquipmentId: string | null = null;

    ngOnInit() {
        this.dataService.getExercisesPreviews$().subscribe((data) => {
            this.exercises = data;
            this.exercisesFiltered = data;
        });
    }

    onExerciseChange($index: number) {
        this.exerciseChangeEvent.emit(this.exercises![$index]);
        this.closeExercisesModal();
    }

    openExercisesModal() {
        this.exercisesModalVisibility = true;
    }

    closeExercisesModal() {
        this.exercisesModalVisibility = false;
        this.exercisesModalCloseEvent.emit();
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

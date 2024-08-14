import {
    Component,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MuscleGroupsModalComponent } from '../../../modals/muscle-groups-modal/muscle-groups-modal.component';
import { EquipmentModalComponent } from '../../../modals/equipment-modal/equipment-modal.component';
import { Exercise } from '../../../../interfaces/exercise';
import { DataService } from '../../../../services/data.service';
import { animate, style, transition, trigger } from '@angular/animations';

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

    searchTerm: string = '';

    onExerciseSearch() {
        this.exercises = this.exercises.filter((exercise) =>
            exercise.name
                .toLowerCase()
                .startsWith(this.searchTerm.toLowerCase())
        );
    }
}

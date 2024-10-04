import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Observable } from 'rxjs';
import { MuscleGroup } from '../../../interfaces/muscle-group';

const visibleModal = { top: '25%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-muscle-groups-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './muscle-groups-modal.component.html',
    styleUrl: './muscle-groups-modal.component.css',
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
export class MuscleGroupsModalComponent implements OnInit {
    @Output() visibilityChangeEvent = new EventEmitter<boolean>();
    @Output() muscleGroupIdChangeEvent = new EventEmitter<string | null>();

    dataService = inject(DataService);

    visibility: boolean = false;
    selectedMuscleGroupName: string | null = null;
    selectedMuscleGroupId: string | null = null;

    muscleGroups$!: Observable<MuscleGroup[]>;

    ngOnInit() {
        this.muscleGroups$ = this.dataService.getMuscleGroups$();
    }

    onOptionSelect(id: string, name: string) {
        if (name === this.selectedMuscleGroupName) {
            this.selectedMuscleGroupId = null;
            this.selectedMuscleGroupName = null;
        } else {
            this.selectedMuscleGroupId = id;
            this.selectedMuscleGroupName = name;
        }

        this.muscleGroupIdChangeEvent.emit(this.selectedMuscleGroupId);

        this.closeModal();
    }

    reset() {
        this.selectedMuscleGroupId = null;
        this.selectedMuscleGroupName = null;
        this.muscleGroupIdChangeEvent.emit(null);
        this.closeModal();
    }

    openModal() {
        this.visibilityChangeEvent.emit(true);
        this.visibility = true;
    }

    closeModal() {
        this.visibilityChangeEvent.emit(false);
        this.visibility = false;
    }
}

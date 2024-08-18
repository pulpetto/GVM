import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuscleGroup } from '../../../interfaces/muscle-group';
import { DataService } from '../../../services/data.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { MuscleGroupName } from '../../../types/muscle-group-type';

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
    @Output() muscleGroupChangeEvent = new EventEmitter<MuscleGroupName>();

    visibility: boolean = false;
    muscleGroups!: MuscleGroup[];
    selectedMuscleGroupName: MuscleGroupName = 'all muscles';
    selectedMuscleGroupId: number = 1;

    dataService = inject(DataService);

    ngOnInit() {
        this.dataService.getMuscleGroups().subscribe((data) => {
            this.muscleGroups = data;
        });
    }

    onOptionSelect(id: number, name: MuscleGroupName) {
        if (id === this.selectedMuscleGroupId) {
            this.selectedMuscleGroupName = 'all muscles';
            this.selectedMuscleGroupId = 1;
        } else {
            this.selectedMuscleGroupName = name;
            this.selectedMuscleGroupId = id;
        }

        this.muscleGroupChangeEvent.emit(this.selectedMuscleGroupName);

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

import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { MuscleGroup } from '../../../interfaces/muscle-group';
import { animate, style, transition, trigger } from '@angular/animations';

const visibleModal = { top: '25%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-muscle-group-selector',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './muscle-group-selector.component.html',
    styleUrl: './muscle-group-selector.component.css',
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
export class MuscleGroupSelectorComponent implements OnInit {
    @Output() muscleGroupChangeEvent = new EventEmitter<string>();
    @Output() muscleGroupRemoveEvent = new EventEmitter<void>();

    modalVisibility: boolean = false;
    muscleGroups$!: Observable<MuscleGroup[]>;
    selectedMuscleGroup: MuscleGroup | null = null;

    dataService = inject(DataService);

    ngOnInit() {
        this.muscleGroups$ = this.dataService.getMuscleGroups2();
    }

    onOptionSelect(clickedmuscleGroupItem: MuscleGroup) {
        if (clickedmuscleGroupItem.id === this.selectedMuscleGroup?.id) {
            this.selectedMuscleGroup = null;
            this.muscleGroupRemoveEvent.emit();
        } else {
            this.selectedMuscleGroup = clickedmuscleGroupItem;
            this.muscleGroupChangeEvent.emit(this.selectedMuscleGroup?.id);
        }

        this.closeModal();
    }

    openModal() {
        this.modalVisibility = true;
    }

    closeModal() {
        this.modalVisibility = false;
    }
}

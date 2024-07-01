import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MuscleGroup } from '../../../interfaces/muscle-group';
import { DataService } from '../../../services/data.service';

@Component({
    selector: 'app-muscle-groups-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './muscle-groups-modal.component.html',
    styleUrl: './muscle-groups-modal.component.css',
})
export class MuscleGroupsModalComponent implements OnInit {
    @Output() visibilityChangeEvent = new EventEmitter<boolean>();

    visibility: boolean = false;
    muscleGroups!: MuscleGroup[];
    selectedMuscleGroupsIds = new Set<number>();

    dataService = inject(DataService);

    ngOnInit() {
        this.dataService.getMuscleGroups().subscribe((data) => {
            this.muscleGroups = data;
        });
    }

    onOptionSelect($index: number) {
        if (this.selectedMuscleGroupsIds.has($index + 1)) {
            this.selectedMuscleGroupsIds.delete($index + 1);
        } else {
            this.selectedMuscleGroupsIds.add($index + 1);
        }
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

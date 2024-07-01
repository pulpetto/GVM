import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Equipment } from '../../../interfaces/equipment';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-equipment-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './equipment-modal.component.html',
    styleUrl: './equipment-modal.component.css',
})
export class EquipmentModalComponent implements OnInit {
    @Output() visibilityChangeEvent = new EventEmitter<boolean>();

    visibility: boolean = false;
    equipment!: Equipment[];
    selectedEquipmentItemsIds = new Set<number>();

    dataService = inject(DataService);

    ngOnInit() {
        this.dataService.getEquipment().subscribe((data) => {
            this.equipment = data;
        });
    }

    onOptionSelect($index: number) {
        if (this.selectedEquipmentItemsIds.has($index + 1)) {
            this.selectedEquipmentItemsIds.delete($index + 1);
        } else {
            this.selectedEquipmentItemsIds.add($index + 1);
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

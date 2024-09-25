import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { EquipmentName } from '../../../types/equipment-type';

const visibleModal = { top: '25%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-equipment-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './equipment-modal.component.html',
    styleUrl: './equipment-modal.component.css',
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
export class EquipmentModalComponent implements OnInit {
    @Output() visibilityChangeEvent = new EventEmitter<boolean>();
    @Output() equipmentChangeEvent = new EventEmitter<EquipmentName>();

    visibility: boolean = false;
    equipment!: {
        id: number;
        name: EquipmentName;
        imageUrl: string;
    }[];
    selectedEquipmentName: EquipmentName = 'all equipment';
    selectedEquipmentId: number = 1;

    dataService = inject(DataService);

    ngOnInit() {
        this.dataService.getEquipment().subscribe((data) => {
            this.equipment = data;
        });
    }

    onOptionSelect(id: number, name: EquipmentName) {
        if (id === this.selectedEquipmentId) {
            this.selectedEquipmentName = 'all equipment';
            this.selectedEquipmentId = 1;
        } else {
            this.selectedEquipmentName = name;
            this.selectedEquipmentId = id;
        }

        this.equipmentChangeEvent.emit(this.selectedEquipmentName);

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

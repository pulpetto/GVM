import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { Equipment } from '../../../interfaces/equipment';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

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

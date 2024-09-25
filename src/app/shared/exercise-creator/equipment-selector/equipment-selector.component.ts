import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Equipment } from '../../../interfaces/equipment';
import { DataService } from '../../../services/data.service';
import { Observable } from 'rxjs';

const visibleModal = { top: '25%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-equipment-selector',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './equipment-selector.component.html',
    styleUrl: './equipment-selector.component.css',
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
export class EquipmentSelectorComponent implements OnInit {
    @Output() equipmentChangeEvent = new EventEmitter<Equipment | null>();

    modalVisibility: boolean = false;
    equipment$!: Observable<Equipment[]>;
    selectedEquipmentItem: Equipment | null = null;

    dataService = inject(DataService);

    ngOnInit() {
        this.equipment$ = this.dataService.getEquipment2();
    }

    onOptionSelect(clickedEquipmentItem: Equipment) {
        if (clickedEquipmentItem.id === this.selectedEquipmentItem?.id) {
            this.selectedEquipmentItem = null;
        } else {
            this.selectedEquipmentItem = clickedEquipmentItem;
        }

        this.equipmentChangeEvent.emit(this.selectedEquipmentItem);

        this.closeModal();
    }

    openModal() {
        this.modalVisibility = true;
    }

    closeModal() {
        this.modalVisibility = false;
    }
}

import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Equipment } from '../../../interfaces/equipment';
import { Observable } from 'rxjs';

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
    dataService = inject(DataService);

    @Output() visibilityChangeEvent = new EventEmitter<boolean>();
    @Output() equipmentIdChangeEvent = new EventEmitter<string | null>();

    visibility: boolean = false;
    selectedEquipmentName: string | null = null;
    selectedEquipmentId: string | null = null;

    equipment$!: Observable<Equipment[]>;

    ngOnInit() {
        this.equipment$ = this.dataService.getEquipment$();
    }

    onOptionSelect(id: string, name: string) {
        if (id === this.selectedEquipmentId) {
            this.selectedEquipmentId = null;
            this.selectedEquipmentName = null;
        } else {
            this.selectedEquipmentId = id;
            this.selectedEquipmentName = name;
        }

        this.equipmentIdChangeEvent.emit(this.selectedEquipmentId);

        this.closeModal();
    }

    reset() {
        this.selectedEquipmentId = null;
        this.selectedEquipmentName = null;
        this.equipmentIdChangeEvent.emit(null);
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

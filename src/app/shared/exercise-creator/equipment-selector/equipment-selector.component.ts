import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { Equipment } from '../../../interfaces/equipment';
import { DataService } from '../../../services/data.service';

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
    dataService = inject(DataService);
    destroyRef = inject(DestroyRef);

    @Input({ required: true }) equipmentId!: FormControl<string | null>;

    modalVisibility: boolean = false;
    equipment!: Equipment[];
    selectedEquipmentName!: string | null;

    ngOnInit() {
        this.dataService
            .getEquipment2()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((equipment) => {
                this.equipment = equipment;

                this.selectedEquipmentName = equipment.filter((eqItem) => {
                    return eqItem.id === this.equipmentId.value;
                })[0]?.name;
            });
    }

    onOptionSelect(clickedEquipmentItem: Equipment) {
        if (clickedEquipmentItem.id === this.equipmentId.value) {
            this.equipmentId.setValue(null);
            this.selectedEquipmentName = null;
        } else {
            this.equipmentId.setValue(clickedEquipmentItem.id);
            this.selectedEquipmentName = clickedEquipmentItem.name;
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

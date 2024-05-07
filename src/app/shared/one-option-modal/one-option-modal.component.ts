import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-one-option-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './one-option-modal.component.html',
    styleUrl: './one-option-modal.component.css',
})
export class OneOptionModalComponent implements OnInit {
    @Input({ required: true }) title!: string;
    @Input({ required: true }) options!: string[];
    @Input({ required: true }) visibility: boolean = false;

    @Output() closeModal = new EventEmitter<void>();
    @Output() activeOptionChange = new EventEmitter<{
        name: string;
        active: boolean;
    }>();

    optionsConverted: {
        name: string;
        active: boolean;
    }[] = [];

    ngOnInit() {
        this.optionsConverted = this.options.map((option, index) => ({
            name: option,
            active: index === 0,
        }));
    }

    onActiveTabChange(clickedIndex: number) {
        this.optionsConverted.find((option) => option.active === true)!.active =
            false;

        const activeOption = this.optionsConverted[clickedIndex];
        activeOption.active = true;

        this.activeOptionChange.emit(activeOption);
        this.closeModal.emit();
    }
}

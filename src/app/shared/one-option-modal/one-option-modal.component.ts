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
    @Input() title!: string;
    @Input() options!: string[];
    @Input() visibility: boolean = false;

    @Output() closeModal = new EventEmitter<void>();
    @Output() activeOption = new EventEmitter<{
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

        this.activeOption.emit(activeOption);
        this.closeModal.emit();
    }
}

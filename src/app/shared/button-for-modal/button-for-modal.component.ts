import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OneOptionModalComponent } from '../one-option-modal/one-option-modal.component';

@Component({
    selector: 'app-button-for-modal',
    standalone: true,
    templateUrl: './button-for-modal.component.html',
    styleUrl: './button-for-modal.component.css',
    imports: [OneOptionModalComponent],
})
export class ButtonForModalComponent {
    @Input() name!: string;
    @Input({ required: true }) modalName!: string;
    @Input({ required: true }) modalOptions!: string[];
    @Output() activeOptionChange = new EventEmitter<{
        name: string;
        active: boolean;
    }>();

    visibility: boolean = false;
}

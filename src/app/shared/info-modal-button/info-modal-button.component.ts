import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-info-modal-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './info-modal-button.component.html',
    styleUrl: './info-modal-button.component.css',
})
export class InfoModalButtonComponent {
    @Input({ required: true }) name!: string;
    @Input({ required: true }) infoContent!: string;

    modalVisibility: boolean = false;
}

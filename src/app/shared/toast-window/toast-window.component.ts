import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-toast-window',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast-window.component.html',
    styleUrl: './toast-window.component.css',
})
export class ToastWindowComponent {
    @Input({ required: true }) message!: string;
    @Input({ required: true }) errorMessage: boolean = false;
    @Input({ required: true }) visibility: boolean = false;

    @Output() closeEvent = new EventEmitter<void>();
}

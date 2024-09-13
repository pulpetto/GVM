import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-toast-window',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast-window.component.html',
    styleUrl: './toast-window.component.css',
})
export class ToastWindowComponent {
    toastService = inject(ToastService);

    toast: Signal<{
        message: string;
        error: boolean;
    } | null> = computed(() => this.toastService.toast());

    close() {
        this.toastService.hide();
    }
}

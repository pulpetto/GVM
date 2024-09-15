import { Component, computed, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

const visible = { right: '50%', opacity: '1' };
const hidden = { right: '-100%', opacity: '0' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-toast-window',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './toast-window.component.html',
    styleUrl: './toast-window.component.css',
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style(hidden),
                animate(timing, style(visible)),
            ]),
            transition(':leave', [
                style(visible),
                animate(timing, style(hidden)),
            ]),
        ]),
    ],
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

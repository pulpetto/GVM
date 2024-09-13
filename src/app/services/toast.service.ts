import { Injectable, Signal, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    toast = signal<{ message: string; error: boolean } | null>(null);

    show(message: string, error: boolean) {
        this.toast.set({ message, error });

        setTimeout(() => {
            this.hide();
        }, 3000);
    }

    hide() {
        this.toast.set(null);
    }
}

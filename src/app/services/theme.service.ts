import { effect, HostBinding, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    darkMode = signal<boolean>(
        typeof window !== 'undefined'
            ? JSON.parse(window.localStorage.getItem('darkMode') ?? 'false')
            : true
    );

    constructor() {
        effect(() => {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(
                    'darkMode',
                    JSON.stringify(this.darkMode())
                );
            }
        });
    }

    @HostBinding('class.dark') get mode() {
        return this.darkMode();
    }

    changeTheme() {
        this.darkMode.set(!this.darkMode());
    }
}

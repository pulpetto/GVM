import { HostBinding, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    darkMode = signal<boolean>(false);

    @HostBinding('class.dark') get mode() {
        return this.darkMode();
    }

    changeTheme() {
        this.darkMode.set(!this.darkMode());
    }
}

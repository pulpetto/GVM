import { Component, HostBinding, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './shared/header/header.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, HomeComponent, HeaderComponent],
})
export class AppComponent {
    title = 'GVM';
    darkMode = signal<boolean>(false);

    @HostBinding('class.dark') get mode() {
        return this.darkMode();
    }
}

import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './shared/header/header.component';
import { ThemeService } from './services/theme.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, HomeComponent, HeaderComponent],
})
export class AppComponent {
    title = 'GVM';

    constructor(private themeService: ThemeService) {}

    @HostBinding('class.dark') get mode() {
        return this.themeService.mode;
    }
}

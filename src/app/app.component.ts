import {
    Component,
    DestroyRef,
    HostBinding,
    inject,
    OnInit,
} from '@angular/core';
import { EventType, Router, RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './shared/header/header.component';
import { ThemeService } from './services/theme.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from './services/user.service';
import { ToastWindowComponent } from './shared/toast-window/toast-window.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
        RouterOutlet,
        HomeComponent,
        HeaderComponent,
        ToastWindowComponent,
    ],
})
export class AppComponent implements OnInit {
    title = 'GVM';

    private destroyRef = inject(DestroyRef);

    isNavigating: boolean = true;

    constructor(
        private userService: UserService,
        private themeService: ThemeService,
        private router: Router
    ) {
        this.router.events
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((e) => {
                this.navigationInterceptor(e.type);
            });
    }

    ngOnInit() {
        this.userService.user$.subscribe((user) => {
            if (user) {
                this.userService.initializeUserAndProperties(user.uid);
            } else {
                this.userService.setUserValue(null);
                this.router.navigate(['/home']);
            }
        });
    }

    private navigationInterceptor(eventType: EventType): void {
        if (eventType === EventType.NavigationStart) {
            this.isNavigating = true;
        }

        if (eventType === EventType.NavigationEnd) {
            this.isNavigating = false;
        }

        // Set loading state to false in both of the below events to hide the animation in case a request fails
        if (eventType === EventType.NavigationCancel) {
            this.isNavigating = false;
        }

        if (eventType === EventType.NavigationError) {
            this.isNavigating = false;
        }
    }

    @HostBinding('class.dark') get mode() {
        return this.themeService.mode;
    }
}

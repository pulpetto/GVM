import {
    Component,
    DestroyRef,
    HostBinding,
    inject,
    OnInit,
} from '@angular/core';
import {
    ActivatedRoute,
    EventType,
    Router,
    RouterOutlet,
} from '@angular/router';
import { ThemeService } from './services/theme.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from './services/user.service';
import { ToastWindowComponent } from './shared/toast-window/toast-window.component';
import {
    animate,
    query,
    style,
    transition,
    trigger,
} from '@angular/animations';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, ToastWindowComponent],
    animations: [
        trigger('routeTransition', [
            transition('* => *', [
                query(':enter', [style({ opacity: 0, scale: 0.9 })], {
                    optional: true,
                }),
                query(
                    ':leave',
                    [animate('0.2s', style({ opacity: 0, scale: 0.9 }))],
                    { optional: true }
                ),
                query(
                    ':enter',
                    [animate('0.2s', style({ opacity: 1, scale: 1 }))],
                    { optional: true }
                ),
            ]),
        ]),
    ],
})
export class AppComponent implements OnInit {
    title = 'GVM';

    private destroyRef = inject(DestroyRef);

    isNavigating: boolean = true;

    constructor(
        private userService: UserService,
        private themeService: ThemeService,
        private router: Router,
        protected route: ActivatedRoute
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

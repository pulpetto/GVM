import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../shared/previous-route-button/previous-route-button.component';
import { NavbarVisibilityService } from '../../../../services/navbar-visibility.service';

@Component({
    selector: 'app-assistant',
    standalone: true,
    imports: [ActivityBarComponent, PreviousRouteButtonComponent],
    templateUrl: './assistant.component.html',
    styleUrl: './assistant.component.css',
})
export class AssistantComponent {
    navbarVisibilityService = inject(NavbarVisibilityService);
    cdr = inject(ChangeDetectorRef);

    ngAfterViewInit() {
        setTimeout(() => {
            this.navbarVisibilityService.visibility.next(false);
        });

        this.cdr.detectChanges();
    }

    ngOnDestroy() {
        this.navbarVisibilityService.visibility.next(true);
    }
}

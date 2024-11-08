import {
    AfterViewInit,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    QueryList,
    Renderer2,
    ViewChildren,
} from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { RouterModule } from '@angular/router';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [RouterModule, ActivityBarComponent],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.css',
})
export class SettingsComponent implements AfterViewInit, OnDestroy {
    userService = inject(UserService);

    logout() {
        this.userService.logoutUser();
    }

    @ViewChildren('stickyElements') stickyElements!: QueryList<ElementRef>;

    constructor(private renderer: Renderer2) {}

    ngAfterViewInit() {
        this.checkStickyPositions();
        window.addEventListener('scroll', this.checkStickyPositions.bind(this));
    }

    checkStickyPositions() {
        this.stickyElements.forEach((stickyElement: ElementRef) => {
            const stickyOffset =
                stickyElement.nativeElement.getBoundingClientRect().top;

            if (stickyOffset <= 0) {
                this.renderer.addClass(
                    stickyElement.nativeElement,
                    'text-center'
                );
                this.renderer.addClass(stickyElement.nativeElement, '-m-4');
                this.renderer.addClass(
                    stickyElement.nativeElement,
                    'rounded-t-none'
                );
            } else {
                this.renderer.removeClass(
                    stickyElement.nativeElement,
                    'text-center'
                );
                this.renderer.removeClass(stickyElement.nativeElement, '-m-4');
                this.renderer.removeClass(
                    stickyElement.nativeElement,
                    'rounded-t-none'
                );
            }
        });
    }

    ngOnDestroy() {
        window.removeEventListener(
            'scroll',
            this.checkStickyPositions.bind(this)
        );
    }
}

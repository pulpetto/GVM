import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    inject,
} from '@angular/core';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { NavbarVisibilityService } from '../../services/navbar-visibility.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-user',
    standalone: true,
    templateUrl: './user.component.html',
    styleUrl: './user.component.css',
    imports: [NavbarComponent, RouterOutlet, CommonModule],
})
export class UserComponent implements AfterViewInit {
    navbarVisibilityService = inject(NavbarVisibilityService);
    cdr = inject(ChangeDetectorRef);

    navbarVisibility$!: Observable<boolean>;

    ngAfterViewInit() {
        this.navbarVisibility$ =
            this.navbarVisibilityService.visibility.asObservable();

        this.cdr.detectChanges();
    }
}

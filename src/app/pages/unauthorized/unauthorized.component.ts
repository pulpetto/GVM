import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-unauthorized',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './unauthorized.component.html',
    styleUrl: './unauthorized.component.css',
})
export class UnauthorizedComponent {
    location = inject(Location);

    navigateBack() {
        this.location.back();
    }
}

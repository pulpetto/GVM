import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-link-bg-icon',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './link-bg-icon.component.html',
    styleUrl: './link-bg-icon.component.css',
})
export class LinkBgIconComponent {
    @Input({ required: true }) name!: string;
    @Input({ required: true }) link!: string;
}

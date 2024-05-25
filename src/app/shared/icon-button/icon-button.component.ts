import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-icon-button',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './icon-button.component.html',
    styleUrl: './icon-button.component.css',
})
export class IconButtonComponent {
    @Input({ required: true }) name!: string;
    @Input({ required: true }) link!: string;
}

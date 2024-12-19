import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-link-button-big',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './link-button-big.component.html',
    styleUrl: './link-button-big.component.css',
})
export class LinkButtonBigComponent {
    @Input({ required: true }) name!: string;
    @Input({ required: true }) link!: string;
}

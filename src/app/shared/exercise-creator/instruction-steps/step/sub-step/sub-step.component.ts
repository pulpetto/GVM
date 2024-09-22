import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-sub-step',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './sub-step.component.html',
    styleUrl: './sub-step.component.css',
})
export class SubStepComponent {
    @Input({ required: true }) subStep!: string;
}

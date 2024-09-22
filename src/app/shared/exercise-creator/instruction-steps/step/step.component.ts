import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-step',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './step.component.html',
    styleUrl: './step.component.css',
})
export class StepComponent {
    @Input({ required: true }) name!: string;
    @Input({ required: true }) subSteps!: string[];
}

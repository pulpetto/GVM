import { Component, Input } from '@angular/core';
import { Step } from '../../../interfaces/step';

@Component({
    selector: 'app-instruction',
    standalone: true,
    imports: [],
    templateUrl: './instruction.component.html',
    styleUrl: './instruction.component.css',
})
export class InstructionComponent {
    @Input({ required: true }) steps!: Step[];

    simplifiedVersion: boolean = true;
}

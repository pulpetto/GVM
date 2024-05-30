import { Component, Input } from '@angular/core';
import { InstructionStep } from '../../../interfaces/instruction-step';

@Component({
    selector: 'app-instruction',
    standalone: true,
    imports: [],
    templateUrl: './instruction.component.html',
    styleUrl: './instruction.component.css',
})
export class InstructionComponent {
    @Input({ required: true }) stepsSimplified!: InstructionStep[];
    @Input({ required: true }) stepsDetailed!: InstructionStep[];

    simplifiedVersion: boolean = true;
}

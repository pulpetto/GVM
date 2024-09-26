import { Component } from '@angular/core';
import { StepComponent } from './step/step.component';
import { FormsModule } from '@angular/forms';
import { Step } from '../../../interfaces/step';

@Component({
    selector: 'app-instruction-steps',
    standalone: true,
    imports: [StepComponent, FormsModule],
    templateUrl: './instruction-steps.component.html',
    styleUrl: './instruction-steps.component.css',
})
export class InstructionStepsComponent {
    steps: Step[] = [];

    newStepNameEditorVisibility: boolean = false;
    newStepName: string = '';

    addStep() {
        this.steps.push({
            name: this.newStepName,
            subSteps: [],
        });

        this.newStepName = '';
        this.newStepNameEditorVisibility = false;
    }
}

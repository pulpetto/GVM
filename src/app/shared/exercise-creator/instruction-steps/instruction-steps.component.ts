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
    steps: Step[] = [
        {
            name: 'Setup',
            subSteps: [
                'Stand with your feet hip-width apart and the bar over your mid-foot.',
                'Bend down and grip the bar just outside your knees.',
                'Keep your back straight and chest up.',
            ],
        },
        {
            name: 'Lift',
            subSteps: [
                'Push through your heels and stand up, lifting the bar.',
                'Keep the bar close to your body.',
                'Stand straight with the bar at thigh level.',
            ],
        },
        {
            name: 'Lockout',
            subSteps: [
                'Stand tall with your hips and knees fully extended.',
                'Keep your shoulders back.',
            ],
        },
        {
            name: 'Descent',
            subSteps: [
                'Push your hips back and bend your knees to lower the bar.',
                'Keep the bar close to your body.',
                'Lower the bar to the ground.',
            ],
        },
        {
            name: 'Reset',
            subSteps: [
                'Ensure your setup is correct before lifting again.',
                'Repeat the steps for additional repetitions.',
            ],
        },
    ];

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

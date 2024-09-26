import { Component, inject, Input } from '@angular/core';
import { StepComponent } from './step/step.component';
import { FormArray, FormBuilder, FormGroup, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-instruction-steps',
    standalone: true,
    imports: [StepComponent, FormsModule],
    templateUrl: './instruction-steps.component.html',
    styleUrl: './instruction-steps.component.css',
})
export class InstructionStepsComponent {
    fb = inject(FormBuilder);

    @Input({ required: true }) steps!: FormArray<FormGroup>;

    newStepNameEditorVisibility: boolean = false;
    newStepName: string = '';

    addStep() {
        const step = this.fb.group({
            name: this.newStepName,
            subSteps: this.fb.array([]),
        });

        this.steps.push(step);

        this.newStepName = '';
        this.newStepNameEditorVisibility = false;
    }

    removeStep(index: number) {
        this.steps.removeAt(index);
    }
}

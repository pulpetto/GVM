import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { SubStepComponent } from './sub-step/sub-step.component';

@Component({
    selector: 'app-step',
    standalone: true,
    imports: [FormsModule, SubStepComponent, ReactiveFormsModule],
    templateUrl: './step.component.html',
    styleUrl: './step.component.css',
})
export class StepComponent {
    fb = inject(FormBuilder);

    @Output() stepRemoveEvent = new EventEmitter<void>();

    @Input({ required: true }) step!: FormGroup<{
        name: FormControl<string>;
        subSteps: FormArray<FormControl<string>>;
    }>;

    get subSteps(): FormArray<FormControl<string>> {
        return this.step.get('subSteps') as FormArray<FormControl<string>>;
    }

    addSubstep() {
        const subStep = this.fb.nonNullable.control(this.newSubstepName);

        this.subSteps.push(subStep);

        this.newSubstepName = '';
        this.newSubstepNameEditorVisibility = false;
    }

    removeStep() {
        this.stepRemoveEvent.emit();
    }

    removeSubstep(index: number) {
        this.subSteps.removeAt(index);
    }

    newSubstepNameEditorVisibility: boolean = false;
    newSubstepName: string = '';
}

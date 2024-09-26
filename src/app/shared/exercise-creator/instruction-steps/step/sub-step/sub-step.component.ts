import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-sub-step',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './sub-step.component.html',
    styleUrl: './sub-step.component.css',
})
export class SubStepComponent {
    @Input({ required: true }) index!: number;
    @Input({ required: true }) subStep!: FormControl<string>;

    @Output() substepRemoveEvent = new EventEmitter<number>();

    removeSubstep() {
        this.substepRemoveEvent.emit(this.index);
    }
}

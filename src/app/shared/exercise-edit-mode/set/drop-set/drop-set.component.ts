import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonForRpeModalComponent } from '../../../button-for-rpe-modal/button-for-rpe-modal.component';

@Component({
    selector: 'app-drop-set',
    standalone: true,
    templateUrl: './drop-set.component.html',
    styleUrl: './drop-set.component.css',
    imports: [CommonModule, FormsModule, ButtonForRpeModalComponent],
})
export class DropSetComponent {
    @Input({ required: true }) dropsetNumber!: number;
    @Output() inputValuesChangeEvent = new EventEmitter<{
        weight: number;
        reps: number;
        rpe: number | null;
    }>();

    updateRpeValue($event: number | null) {
        this.rpe = $event;

        this.onAnyValueChange();
    }

    onAnyValueChange() {
        this.inputValuesChangeEvent.emit({
            weight: this.weight,
            reps: this.reps,
            rpe: this.rpe,
        });
    }

    weight!: number;
    reps!: number;
    rpe!: number | null;

    rpeModalVisibility: boolean = false;
}

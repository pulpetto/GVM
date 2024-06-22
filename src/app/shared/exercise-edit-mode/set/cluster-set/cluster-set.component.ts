import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonForRpeModalComponent } from '../../../button-for-rpe-modal/button-for-rpe-modal.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-cluster-set',
    standalone: true,
    templateUrl: './cluster-set.component.html',
    styleUrl: './cluster-set.component.css',
    imports: [ButtonForRpeModalComponent, FormsModule],
})
export class ClusterSetComponent {
    @Output() inputValuesChangeEvent = new EventEmitter<{
        restTime: number;
        reps: number;
        rpe: number | null;
    }>();

    updateRpeValue($event: number | null) {
        this.rpe = $event;

        this.onAnyValueChange();
    }

    onAnyValueChange() {
        this.inputValuesChangeEvent.emit({
            restTime: this.restTime,
            reps: this.reps,
            rpe: this.rpe,
        });
    }

    restTime!: number;
    reps!: number;
    rpe!: number | null;

    rpeModalVisibility: boolean = false;
}

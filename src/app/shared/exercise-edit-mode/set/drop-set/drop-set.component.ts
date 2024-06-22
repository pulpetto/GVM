import { Component, EventEmitter, Output } from '@angular/core';
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
    @Output() rpeValueChangeEvent = new EventEmitter<number>();

    onRpeValueChange($event: number) {
        this.rpeValueChangeEvent.emit($event);
    }

    weight!: number;
    reps!: number;

    rpeModalVisibility: boolean = false;
}

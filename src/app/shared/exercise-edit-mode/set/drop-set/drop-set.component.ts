import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';
import { ButtonForRpeModalComponent } from '../../../button-for-rpe-modal/button-for-rpe-modal.component';
import { RpeType } from '../../../../types/rpe-type';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-drop-set',
    standalone: true,
    templateUrl: './drop-set.component.html',
    styleUrl: './drop-set.component.css',
    imports: [
        CommonModule,
        FormsModule,
        ButtonForRpeModalComponent,
        ReactiveFormsModule,
    ],
})
export class DropSetComponent {
    @Input({ required: true }) dropset!: FormGroup;
    @Input({ required: true }) dropsetNumber!: number;

    updateRpeValue($event: RpeType) {
        this.dropset.get('rpe')?.setValue($event);
    }
}

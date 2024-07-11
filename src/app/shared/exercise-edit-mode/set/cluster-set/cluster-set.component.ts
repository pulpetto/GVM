import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { ButtonForRpeModalComponent } from '../../../button-for-rpe-modal/button-for-rpe-modal.component';
import { FormGroup, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RpeType } from '../../../../types/rpe-type';
import { ClusterSet } from '../../../../interfaces/set-types/cluster-set';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-cluster-set',
    standalone: true,
    templateUrl: './cluster-set.component.html',
    styleUrl: './cluster-set.component.css',
    imports: [
        ButtonForRpeModalComponent,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
    ],
})
export class ClusterSetComponent {
    @Input({ required: true }) clusterset!: FormGroup;

    @Output() inputValuesChangeEvent = new EventEmitter<ClusterSet>();

    updateRpeValue($event: RpeType) {
        this.clusterset.get('rpe')?.setValue($event);
    }

    restTimeValue: number | null = null;
    restTimeModalVisibility: boolean = false;
    restTimesScale: number[] = [5, 10, 15, 20, 25, 30];

    hoveredRestTimeValue: number | null = null;
    hoverSquareLeftDistancePx: number = 0;
    hoverSquareShadowLeftDistancePx: number = 0;

    @ViewChildren('restTimeButton')
    restTimesValuesButtons!: QueryList<ElementRef>;

    updateRestTime(restTime: number, $index: number) {
        if (+this.clusterset.get('restTime')?.value === restTime) {
            this.restTimeValue = null;
            this.clusterset.get('restTime')?.setValue(null);

            this.hoverSquareLeftDistancePx = 0;
        } else {
            this.restTimeValue = restTime;
            this.clusterset.get('restTime')?.setValue(restTime);

            this.hoverSquareLeftDistancePx =
                this.restTimesValuesButtons.toArray()[
                    $index
                ].nativeElement.offsetLeft;
        }
    }

    onRestTimeMouseOver(restTime: number, $index: number) {
        this.hoveredRestTimeValue = restTime;

        this.hoverSquareShadowLeftDistancePx =
            this.restTimesValuesButtons.toArray()[
                $index
            ].nativeElement.offsetLeft;
    }

    onRestTimeMouseOut() {
        this.hoveredRestTimeValue = null;
    }
}

import {
    Component,
    ElementRef,
    EventEmitter,
    Output,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { ButtonForRpeModalComponent } from '../../../button-for-rpe-modal/button-for-rpe-modal.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RpeType } from '../../../../types/rpe-type';
import { ClusterSet } from '../../../../interfaces/set-types/cluster-set';

@Component({
    selector: 'app-cluster-set',
    standalone: true,
    templateUrl: './cluster-set.component.html',
    styleUrl: './cluster-set.component.css',
    imports: [ButtonForRpeModalComponent, FormsModule, CommonModule],
})
export class ClusterSetComponent {
    @Output() inputValuesChangeEvent = new EventEmitter<ClusterSet>();

    updateRpeValue($event: RpeType) {
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

    restTime: number | null = null;
    reps: number | null = null;
    rpe: RpeType = null;

    restTimeModalVisibility: boolean = false;
    restTimesScale: number[] = [5, 10, 15, 20, 25, 30];

    hoveredRestTimeValue: number | null = null;
    hoverSquareLeftDistancePx: number = 0;
    hoverSquareShadowLeftDistancePx: number = 0;

    @ViewChildren('restTimeButton')
    restTimesValuesButtons!: QueryList<ElementRef>;

    onRestTimeChange(restTime: number, $index: number) {
        if (this.restTime === restTime) {
            this.restTime = null;
            this.onAnyValueChange();
            this.hoverSquareLeftDistancePx = 0;
        } else {
            this.restTime = restTime;
            this.onAnyValueChange();
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

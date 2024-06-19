import {
    Component,
    ElementRef,
    Input,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
    selector: 'app-set',
    standalone: true,
    imports: [CommonModule, FormsModule, NgxMaskDirective],
    templateUrl: './set.component.html',
    styleUrl: './set.component.css',
})
export class SetComponent {
    @Input({ required: true }) lighterBg: boolean = false;
    @Input({ required: true }) number!: number;

    weight!: number;
    weightLength!: number;
    reps!: number;
    rpe!: number | null;

    setTypeIndex: number = 0;

    setTypeModalVisibility: boolean = false;
    rpeModalVisibility: boolean = false;
    leftDistancePx: number = 0;
    rpeScale = [6, 7, 8, 9, 9.5, 10];

    @ViewChildren('rpeValBtn') rpeValuesButtons!: QueryList<ElementRef>;

    onRpeValueChange(rpeValue: number, $index: number) {
        if (this.rpe === rpeValue) {
            this.rpe = null;
            this.leftDistancePx = 0;
        } else {
            this.rpe = rpeValue;
            this.leftDistancePx =
                this.rpeValuesButtons.toArray()[
                    $index
                ].nativeElement.offsetLeft;
        }
    }

    leftDistancePxHover: number = 0;
    hoveredRpeValue: number | null = null;

    onRpeMouseOver(rpeValue: number, $index: number) {
        this.hoveredRpeValue = rpeValue;

        this.leftDistancePxHover =
            this.rpeValuesButtons.toArray()[$index].nativeElement.offsetLeft;
    }

    onRpeMouseOut() {
        this.hoveredRpeValue = null;
    }

    setTypes = [
        {
            name: 'normal',
            textColor: 'text-white',
            borderColor: 'border-white',
            isSelected: true,
        },
        {
            name: 'warmup',
            textColor: 'text-yellow-500',
            borderColor: 'border-yellow-500',
            isSelected: false,
        },
        {
            name: 'failure',
            textColor: 'text-red-500',
            borderColor: 'border-red-500',
            isSelected: false,
        },
        {
            name: 'partials',
            textColor: 'text-fuchsia-500',
            borderColor: 'border-fuchsia-500',
            isSelected: false,
        },
        {
            name: 'paused',
            textColor: 'text-blue-500',
            borderColor: 'border-blue-500',
            isSelected: false,
        },
        {
            name: 'iso',
            textColor: 'text-indigo-500',
            borderColor: 'border-indigo-500',
            isSelected: false,
        },
        {
            name: 'slow eccentric',
            textColor: 'text-green-500',
            borderColor: 'border-green-500',
            isSelected: false,
        },
        {
            name: 'tempo',
            textColor: 'text-teal-500',
            borderColor: 'border-teal-500',
            isSelected: false,
        },
        {
            name: 'drop',
            textColor: 'text-orange-500',
            borderColor: 'border-orange-500',
            isSelected: false,
        },
        {
            name: 'cluster',
            textColor: 'text-amber-500',
            borderColor: 'border-amber-500',
            isSelected: false,
        },
    ];

    onSetTypeChange($index: number) {
        this.setTypes.forEach((set) => (set.isSelected = false));
        this.setTypes[$index].isSelected = true;
        this.setTypeIndex = $index;

        this.setTypeModalVisibility = false;
    }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-set',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './set.component.html',
    styleUrl: './set.component.css',
})
export class SetComponent {
    @Input({ required: true }) lighterBg: boolean = false;
    @Input({ required: true }) number!: number;
    setTypeIndex: number = 0;
    @Input({ required: true }) weight!: number;
    @Input({ required: true }) reps!: number;
    @Input({ required: true }) rpe!: number;

    modalVisibility: boolean = false;

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
            name: 'paused',
            textColor: 'text-blue-500',
            borderColor: 'border-blue-500',
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
        {
            name: 'iso',
            textColor: 'text-indigo-500',
            borderColor: 'border-indigo-500',
            isSelected: false,
        },
        {
            name: 'partials',
            textColor: 'text-fuchsia-500',
            borderColor: 'border-fuchsia-500',
            isSelected: false,
        },
        {
            name: 'slow eccentric',
            textColor: 'text-green-500',
            borderColor: 'border-green-500',
            isSelected: false,
        },
    ];

    onSetTypeChange($index: number) {
        this.setTypes.forEach((set) => (set.isSelected = false));
        this.setTypes[$index].isSelected = true;
        this.setTypeIndex = $index;

        this.modalVisibility = false;
    }
}
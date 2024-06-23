import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { InfoModalButtonComponent } from '../../info-modal-button/info-modal-button.component';
import { DropSetComponent } from './drop-set/drop-set.component';
import { ButtonForRpeModalComponent } from '../../button-for-rpe-modal/button-for-rpe-modal.component';
import { ClusterSetComponent } from './cluster-set/cluster-set.component';

@Component({
    selector: 'app-set',
    standalone: true,
    templateUrl: './set.component.html',
    styleUrl: './set.component.css',
    imports: [
        CommonModule,
        FormsModule,
        NgxMaskDirective,
        InfoModalButtonComponent,
        DropSetComponent,
        ButtonForRpeModalComponent,
        ClusterSetComponent,
    ],
})
export class SetComponent {
    @Input({ required: true }) lighterBg: boolean = false;
    @Input({ required: true }) number!: number;

    weight!: number;
    reps!: number;
    onRpeValueChange($event: number | null) {
        this.rpe = $event;
    }
    rpe!: number | null;

    setTypeIndex: number = 0;
    setTypeName: string = 'normal';

    setTypeModalVisibility: boolean = false;

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
        this.setTypeName = this.setTypes[$index].name;

        // clear all settypes data
        this.dropsets = [];
        this.clustersets = [];

        this.setTypeModalVisibility = false;
    }

    // Dropset Logic ---------------------------
    dropsets: {
        weight: null | number;
        reps: null | number;
        rpe: null | number;
    }[] = [];

    addDropSet() {
        this.dropsets.push({
            weight: null,
            reps: null,
            rpe: null,
        });
    }

    updateDropsetValues(
        $event: { weight: number; reps: number; rpe: number | null },
        $index: number
    ) {
        this.dropsets[$index] = $event;
    }

    // Clusterset Logic ---------------------------
    clustersets: {
        restTime: null | number;
        reps: null | number;
        rpe: null | number;
    }[] = [];

    addClusterSet() {
        this.clustersets.push({
            restTime: null,
            reps: null,
            rpe: null,
        });
    }

    updateClustersetValues(
        $event: {
            restTime: number | null;
            reps: number;
            rpe: number | null;
        },
        $index: number
    ) {
        this.clustersets[$index] = $event;
    }
}

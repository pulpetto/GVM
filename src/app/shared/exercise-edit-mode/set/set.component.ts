import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { InfoModalButtonComponent } from '../../info-modal-button/info-modal-button.component';
import { DropSetComponent } from './drop-set/drop-set.component';
import { ButtonForRpeModalComponent } from '../../button-for-rpe-modal/button-for-rpe-modal.component';
import { ClusterSetComponent } from './cluster-set/cluster-set.component';
import { SetType } from '../../../types/set-type';
import { TempoSetComponent } from './tempo-set/tempo-set.component';
import { TempoSet } from '../../../interfaces/tempo-set';
import { RpeType } from '../../../types/rpe-type';
import { DropSet } from '../../../interfaces/set-types/drop-set';
import { ClusterSet } from '../../../interfaces/set-types/cluster-set';
import { ReactiveFormsModule } from '@angular/forms';

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
        TempoSetComponent,
        ReactiveFormsModule,
    ],
})
export class SetComponent implements OnInit {
    fb = inject(FormBuilder);

    @Input({ required: true }) set!: FormGroup;
    @Input({ required: true }) setNumber!: number;
    @Input({ required: true }) lighterBg: boolean = false;

    ngOnInit() {
        this.set.addControl('setTypeName', this.fb.control<SetType>('normal'));
        this.set.addControl('weight', this.fb.control(null));
        this.set.addControl('reps', this.fb.control(null));
        this.set.addControl('rpe', this.fb.control<RpeType>(null));
    }

    onRpeValueChange($event: RpeType) {
        this.set.get('rpe')!.setValue($event);
    }

    updateTempo($event: TempoSet) {
        this.set.get('tempo')!.setValue($event);
    }

    setTypeIndex: number = 0;
    setTypeName: SetType = 'normal';

    setTypeModalVisibility: boolean = false;

    setTypes: {
        name: SetType;
        textColor: string;
        borderColor: string;
        isSelected: boolean;
    }[] = [
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

        this.dropsets = [];
        this.clustersets = [];

        this.setTypeModalVisibility = false;
    }

    // Dropset Logic ---------------------------
    dropsets: DropSet[] = [];

    addDropSet() {
        this.dropsets.push({
            weight: null,
            reps: null,
            rpe: null,
        });
    }

    updateDropsetValues($event: DropSet, $index: number) {
        this.dropsets[$index] = $event;
    }

    // Clusterset Logic ---------------------------
    clustersets: ClusterSet[] = [];

    addClusterSet() {
        this.clustersets.push({
            restTime: null,
            reps: null,
            rpe: null,
        });
    }

    updateClustersetValues($event: ClusterSet, $index: number) {
        this.clustersets[$index] = $event;
    }
}

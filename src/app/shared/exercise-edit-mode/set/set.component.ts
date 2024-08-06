import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
} from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { InfoModalButtonComponent } from '../../info-modal-button/info-modal-button.component';
import { DropSetComponent } from './drop-set/drop-set.component';
import { ButtonForRpeModalComponent } from '../../button-for-rpe-modal/button-for-rpe-modal.component';
import { ClusterSetComponent } from './cluster-set/cluster-set.component';
import { SetType } from '../../../types/set-type';
import { TempoSetComponent } from './tempo-set/tempo-set.component';
import { TempoSet } from '../../../interfaces/set-types/tempo-set';
import { RpeType } from '../../../types/rpe-type';
import { DropSet } from '../../../interfaces/set-types/drop-set';
import { ClusterSet } from '../../../interfaces/set-types/cluster-set';
import { ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

const visibleModal = { top: '25%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

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
    animations: [
        trigger('openClose', [
            transition(':enter', [
                style(hiddenModal),
                animate(timing, style(visibleModal)),
            ]),
            transition(':leave', [
                style(visibleModal),
                animate(timing, style(hiddenModal)),
            ]),
        ]),
        trigger('openClose2', [
            transition(':enter', [
                style(hiddenBg),
                animate(timing, style(visibleBg)),
            ]),
            transition(':leave', [
                style(visibleBg),
                animate(timing, style(hiddenBg)),
            ]),
        ]),
        trigger('openClose3', [
            transition(':enter', [
                style(hiddenBtnFixed),
                animate(timing, style(visibleBtnFixed)),
            ]),
            transition(':leave', [
                style(visibleBtnFixed),
                animate(timing, style(hiddenBtnFixed)),
            ]),
        ]),
    ],
})
export class SetComponent implements OnInit {
    fb = inject(FormBuilder);

    @Input({ required: true }) set!: FormGroup;
    @Input({ required: true }) setNumber!: number;
    @Input({ required: true }) lighterBg: boolean = false;

    ngOnInit() {
        this.set.addControl('setTypeName', this.fb.control<SetType>('normal'));
        this.set.addControl('weight', this.fb.control<string>(''));
        this.set.addControl('reps', this.fb.control<string>(''));
        this.set.addControl('rpe', this.fb.control<RpeType>(null));
    }

    get rpe(): FormControl<RpeType> {
        return this.set.get('rpe') as FormControl<RpeType>;
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

        this.set.get('setTypeName')?.setValue(this.setTypeName);

        if (this.setTypeName === 'drop') {
            this.set.addControl('dropsets', this.fb.array<DropSet[]>([]));

            this.set.removeControl('clustersets');
            this.set.removeControl('tempo');
        }

        if (this.setTypeName === 'cluster') {
            this.set.addControl('clustersets', this.fb.array<ClusterSet[]>([]));

            this.set.removeControl('dropsets');
            this.set.removeControl('tempo');
        }

        if (this.setTypeName === 'tempo') {
            this.set.addControl(
                'tempo',
                this.fb.control<TempoSet | null>(null)
            );

            this.set.removeControl('dropsets');
            this.set.removeControl('clustersets');
        }

        this.setTypeModalVisibility = false;
    }

    // Dropset Logic ---------------------------

    get dropsets(): FormArray<FormGroup> {
        return this.set.get('dropsets') as FormArray<FormGroup>;
    }

    addDropSet() {
        const dropsetObj = this.fb.group({
            weight: null,
            reps: null,
            rpe: null,
        });

        this.dropsets.push(dropsetObj);
    }

    // Clusterset Logic ---------------------------

    get clustersets(): FormArray<FormGroup> {
        return this.set.get('clustersets') as FormArray<FormGroup>;
    }

    addClusterSet() {
        const clustersetObj = this.fb.group({
            restTime: null,
            reps: null,
            rpe: null,
        });

        this.clustersets.push(clustersetObj);
    }
}

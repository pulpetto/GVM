import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { MuscleGroup } from '../../../interfaces/muscle-group';
import { DataService } from '../../../services/data.service';
import { ToastService } from '../../../services/toast.service';

const visibleModal = { top: '25%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-muscle-group-selector',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './muscle-group-selector.component.html',
    styleUrl: './muscle-group-selector.component.css',
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
export class MuscleGroupSelectorComponent implements OnInit {
    dataService = inject(DataService);
    destroyRef = inject(DestroyRef);
    fb = inject(FormBuilder);
    toastService = inject(ToastService);

    @Input({ required: true }) muscleGroupIds!: FormArray<
        FormControl<string | null>
    >;

    selectedMuscleGroupsIds: Set<string> = new Set();
    selectedMuscleGroups: MuscleGroup[] = [];

    modalVisibility: boolean = false;
    muscleGroups!: MuscleGroup[];

    ngOnInit() {
        this.dataService
            .getMuscleGroups$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((muscleGroups) => {
                this.muscleGroups = muscleGroups;

                if (this.muscleGroupIds.length > 0) {
                    this.muscleGroupIds.controls.forEach((id) => {
                        const foundMuscleGroup = muscleGroups.find(
                            (mg) => mg.id === id.value
                        );

                        if (foundMuscleGroup) {
                            this.selectedMuscleGroupsIds.add(
                                foundMuscleGroup.id
                            );
                            this.selectedMuscleGroups.push(foundMuscleGroup);
                        }
                    });
                }
            });
    }

    onOptionSelect(clickedmuscleGroupItem: MuscleGroup) {
        if (this.selectedMuscleGroupsIds.has(clickedmuscleGroupItem.id)) {
            this.selectedMuscleGroupsIds.delete(clickedmuscleGroupItem.id);

            const indexToRemove = this.selectedMuscleGroups.indexOf(
                clickedmuscleGroupItem
            );
            this.selectedMuscleGroups.splice(indexToRemove, 1);
            this.muscleGroupIds.removeAt(indexToRemove);
        } else {
            if (this.selectedMuscleGroups.length === 3) {
                this.toastService.show('3 Muscle groups is max!', true);
            } else {
                this.selectedMuscleGroupsIds.add(clickedmuscleGroupItem.id);
                this.selectedMuscleGroups.push(clickedmuscleGroupItem);
                this.muscleGroupIds.push(
                    this.fb.control(clickedmuscleGroupItem.id)
                );
            }
        }

        this.closeModal();
    }

    openModal() {
        this.modalVisibility = true;
    }

    closeModal() {
        this.modalVisibility = false;
    }
}

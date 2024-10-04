import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MuscleGroup } from '../../../interfaces/muscle-group';
import { DataService } from '../../../services/data.service';

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

    @Input({ required: true }) muscleGroupId!: FormControl<string | null>;

    @Output() muscleGroupRemoveEvent = new EventEmitter<void>();

    modalVisibility: boolean = false;
    muscleGroups!: MuscleGroup[];
    selectedMuscleGroupName: string | null = null;

    ngOnInit() {
        this.dataService
            .getMuscleGroups$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((muscleGroups) => {
                this.muscleGroups = muscleGroups;

                this.selectedMuscleGroupName = muscleGroups.filter(
                    (muscleGroup) => {
                        return muscleGroup.id === this.muscleGroupId.value;
                    }
                )[0]?.name;
            });
    }

    onOptionSelect(clickedmuscleGroupItem: MuscleGroup) {
        if (clickedmuscleGroupItem.id === this.muscleGroupId.value) {
            this.selectedMuscleGroupName = null;
            this.muscleGroupRemoveEvent.emit();
        } else {
            this.selectedMuscleGroupName = clickedmuscleGroupItem.name;
            this.muscleGroupId.setValue(clickedmuscleGroupItem.id);
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

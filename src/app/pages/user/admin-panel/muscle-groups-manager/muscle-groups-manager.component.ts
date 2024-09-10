import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-muscle-groups-manager',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './muscle-groups-manager.component.html',
    styleUrl: './muscle-groups-manager.component.css',
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
export class MuscleGroupsManagerComponent {
    newMuscleGroupModalVisibility: boolean = false;

    @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

    selectedImage: string | ArrayBuffer | null = null;

    onImageSelect() {
        if (this.imageInput.nativeElement.files) {
            const thumbnail = this.imageInput.nativeElement.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                this.selectedImage = reader.result;
            };

            reader.readAsDataURL(thumbnail);
        }
    }

    onImageRemove() {
        this.selectedImage = null;
    }
}

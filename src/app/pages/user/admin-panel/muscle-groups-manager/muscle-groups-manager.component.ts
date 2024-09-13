import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { Observable, tap } from 'rxjs';

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
    imports: [CommonModule, FormsModule],
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
    uploadProgress$!: Observable<number | null>;
    isUploading: boolean = false;

    adminService = inject(AdminService);

    newMuscleGroupModalVisibility: boolean = false;

    @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

    selectedImagePreview: string | ArrayBuffer | null = null;
    selectedImageFile: File | null = null;

    onImageSelect() {
        if (this.imageInput.nativeElement.files) {
            this.selectedImageFile = this.imageInput.nativeElement.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                this.selectedImagePreview = reader.result;
            };

            reader.readAsDataURL(this.selectedImageFile);
        }
    }

    onImageRemove() {
        this.selectedImagePreview = null;
        this.selectedImageFile = null;
    }

    newMuscleGroupName: string = '';

    closeNewMuscleGroupModal() {
        this.isUploading = false;
        this.selectedImagePreview = null;
        this.selectedImageFile = null;
        this.newMuscleGroupName = '';
        this.newMuscleGroupModalVisibility = false;
    }

    addNewMuscleGroup() {
        this.isUploading = true;

        this.uploadProgress$ = this.adminService
            .addNewMuscleGroup(this.newMuscleGroupName, this.selectedImageFile!)
            .pipe(
                tap((progress) => {
                    if (progress === 100) {
                        this.closeNewMuscleGroupModal();
                    }
                    if (progress === null) {
                        // this.progressError = true;
                    }
                })
            );
    }
}

import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
    Component,
    ElementRef,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { Observable } from 'rxjs';
import { ToastService } from '../../../../services/toast.service';
import { ActivityBarComponent } from '../../../../shared/activity-bar/activity-bar.component';
import { PreviousRouteButtonComponent } from '../../../../shared/previous-route-button/previous-route-button.component';

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
    imports: [
        CommonModule,
        FormsModule,
        ActivityBarComponent,
        PreviousRouteButtonComponent,
    ],
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
export class MuscleGroupsManagerComponent implements OnInit {
    adminService = inject(AdminService);
    toastService = inject(ToastService);

    isUploading: boolean = false;

    muscleGroups$!: Observable<
        {
            id: string;
            name: string;
            imagePreviewUrl: string;
            imageFilePath: string;
        }[]
    >;

    ngOnInit() {
        this.muscleGroups$ = this.adminService.getMuscleGroups();
    }

    // ---------- Adding Muscle Group Logic ----------
    @ViewChild('newMuscleGroupImageInput')
    newMuscleGroupImageInput!: ElementRef<HTMLInputElement>;
    newMuscleGroupModalVisibility: boolean = false;
    newMuscleGroupImagePreview: string | ArrayBuffer | null = null;
    newMuscleGroupImageFile: File | null = null;
    newMuscleGroupName: string = '';

    onNewMuscleGroupImageSelect() {
        if (this.newMuscleGroupImageInput.nativeElement.files) {
            this.newMuscleGroupImageFile =
                this.newMuscleGroupImageInput.nativeElement.files[0];

            const reader = new FileReader();

            reader.onload = () => {
                this.newMuscleGroupImagePreview = reader.result;
            };

            reader.readAsDataURL(this.newMuscleGroupImageFile);
        }
    }

    onNewMuscleGroupImageRemove() {
        this.newMuscleGroupImagePreview = null;
        this.newMuscleGroupImageFile = null;
    }

    onNewMuscleGroupModalClose() {
        this.isUploading = false;
        this.newMuscleGroupImagePreview = null;
        this.newMuscleGroupImageFile = null;
        this.newMuscleGroupName = '';
        this.newMuscleGroupModalVisibility = false;
    }

    async onNewMuscleGroupAdd() {
        this.isUploading = true;

        try {
            this.adminService.addNewMuscleGroup(
                this.newMuscleGroupName,
                this.newMuscleGroupImageFile!
            );

            this.toastService.show('Uploaded successfully', false);
            this.onNewMuscleGroupModalClose();
        } catch (error) {
            this.toastService.show('Upload error', true);
            this.onNewMuscleGroupModalClose();
        }
    }

    // ---------- Modifying Muscle Group Logic ----------
    @ViewChild('modifyMuscleGroupImageInput')
    modifyMuscleGroupImageInput!: ElementRef<HTMLInputElement>;
    modifyMuscleGroupModalVisibility: boolean = false;
    modifyMuscleGroupImagePreview: string | ArrayBuffer | null = null;
    modifyMuscleGroupImageFile: File | null = null;
    modifyMuscleGroupName: string = '';
    // backend
    modifyMuscleGroupId: string = '';
    modifyMuscleGroupImageFilePath: string = '';

    onModifyMuscleGroupModalOpen(MuscleGroupItem: {
        id: string;
        name: string;
        imagePreviewUrl: string;
        imageFilePath: string;
    }) {
        this.modifyMuscleGroupModalVisibility = true;
        this.modifyMuscleGroupImagePreview = MuscleGroupItem.imagePreviewUrl;
        this.modifyMuscleGroupImageFile = null;
        this.modifyMuscleGroupName = MuscleGroupItem.name;
        this.modifyMuscleGroupId = MuscleGroupItem.id;
        this.modifyMuscleGroupImageFilePath = MuscleGroupItem.imageFilePath;
    }

    onModifyMuscleGroupImageSelect() {
        if (this.modifyMuscleGroupImageInput.nativeElement.files) {
            this.modifyMuscleGroupImageFile =
                this.modifyMuscleGroupImageInput.nativeElement.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                this.modifyMuscleGroupImagePreview = reader.result;
            };

            reader.readAsDataURL(this.modifyMuscleGroupImageFile!);
        }
    }

    onModifyMuscleGroupImageRemove() {
        this.modifyMuscleGroupImagePreview = null;
        this.modifyMuscleGroupImageFile = null;
    }

    onModifyMuscleGroupModalclose() {
        this.modifyMuscleGroupModalVisibility = false;
    }

    async onMuscleGroupModify() {
        try {
            this.adminService.modifyMuscleGroup(
                this.modifyMuscleGroupId,
                this.modifyMuscleGroupImageFilePath,
                this.modifyMuscleGroupName,
                this.modifyMuscleGroupImageFile
            );

            this.toastService.show('Modified successfully', false);
            this.onModifyMuscleGroupModalclose();
        } catch (error) {
            this.toastService.show('Modification error', true);
            this.onModifyMuscleGroupModalclose();
        }
    }

    // ---------- Deleting Muscle Group Logic ----------
    async onMuscleGroupDelete() {
        try {
            this.adminService.deleteMuscleGroup(
                this.modifyMuscleGroupId,
                this.modifyMuscleGroupImageFilePath
            );

            this.toastService.show('Deleted successfully', false);
            this.onModifyMuscleGroupModalclose();
        } catch (error) {
            this.toastService.show('Deletion error', true);
            this.onModifyMuscleGroupModalclose();
        }
    }
}

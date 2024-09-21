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

const visibleModal = { top: '50%' };
const hiddenModal = { top: '100%' };

const visibleBg = { opacity: '100%' };
const hiddenBg = { opacity: '0%' };

const visibleBtnFixed = { bottom: '0' };
const hiddenBtnFixed = { bottom: '-100%' };

const timing = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

@Component({
    selector: 'app-equipment-manager',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './equipment-manager.component.html',
    styleUrl: './equipment-manager.component.css',
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
export class EquipmentManagerComponent implements OnInit {
    adminService = inject(AdminService);
    toastService = inject(ToastService);

    isUploading: boolean = false;

    equipment$!: Observable<
        {
            id: string;
            name: string;
            imagePreviewUrl: string;
            imageFilePath: string;
        }[]
    >;

    ngOnInit() {
        this.equipment$ = this.adminService.getEquipment();
    }

    // ---------- Adding Equipment Logic ----------
    @ViewChild('newEquipmentImageInput')
    newEquipmentImageInput!: ElementRef<HTMLInputElement>;
    newEquipmentModalVisibility: boolean = false;
    newEquipmentImagePreview: string | ArrayBuffer | null = null;
    newEquipmentImageFile: File | null = null;
    newEquipmentName: string = '';

    onNewEquipmentImageSelect() {
        if (this.newEquipmentImageInput.nativeElement.files) {
            this.newEquipmentImageFile =
                this.newEquipmentImageInput.nativeElement.files[0];

            const reader = new FileReader();

            reader.onload = () => {
                this.newEquipmentImagePreview = reader.result;
            };

            reader.readAsDataURL(this.newEquipmentImageFile);
        }
    }

    onNewEquipmentImageRemove() {
        this.newEquipmentImagePreview = null;
        this.newEquipmentImageFile = null;
    }

    onNewEquipmentModalClose() {
        this.isUploading = false;
        this.newEquipmentImagePreview = null;
        this.newEquipmentImageFile = null;
        this.newEquipmentName = '';
        this.newEquipmentModalVisibility = false;
    }

    async onNewEquipmentAdd() {
        this.isUploading = true;

        try {
            this.adminService.addEquipment(
                this.newEquipmentName,
                this.newEquipmentImageFile!
            );

            this.toastService.show('Uploaded successfully', false);
            this.onNewEquipmentModalClose();
        } catch (error) {
            this.toastService.show('Upload error', true);
            this.onNewEquipmentModalClose();
        }
    }

    // ---------- Modifying Equipment Logic ----------
    @ViewChild('modifyEquipmentImageInput')
    modifyEquipmentImageInput!: ElementRef<HTMLInputElement>;
    modifyEquipmentModalVisibility: boolean = false;
    modifyEquipmentImagePreview: string | ArrayBuffer | null = null;
    modifyEquipmentImageFile: File | null = null;
    modifyEquipmentName: string = '';
    // backend
    modifyEquipmentId: string = '';
    modifyEquipmentImageFilePath: string = '';

    onModifyEquipmentModalOpen(equipmentItem: {
        id: string;
        name: string;
        imagePreviewUrl: string;
        imageFilePath: string;
    }) {
        this.modifyEquipmentModalVisibility = true;
        this.modifyEquipmentImagePreview = equipmentItem.imagePreviewUrl;
        this.modifyEquipmentImageFile = null;
        this.modifyEquipmentName = equipmentItem.name;
        this.modifyEquipmentId = equipmentItem.id;
        this.modifyEquipmentImageFilePath = equipmentItem.imageFilePath;
    }

    onModifyEquipmentImageSelect() {
        if (this.modifyEquipmentImageInput.nativeElement.files) {
            this.modifyEquipmentImageFile =
                this.modifyEquipmentImageInput.nativeElement.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                this.modifyEquipmentImagePreview = reader.result;
            };

            reader.readAsDataURL(this.modifyEquipmentImageFile!);
        }
    }

    onModifyEquipmentImageRemove() {
        this.modifyEquipmentImagePreview = null;
        this.modifyEquipmentImageFile = null;
    }

    onModifyEquipmentModalclose() {
        this.modifyEquipmentModalVisibility = false;
    }

    async onEquipmentModify() {
        try {
            this.adminService.modifyEquipment(
                this.modifyEquipmentId,
                this.modifyEquipmentImageFilePath,
                this.modifyEquipmentName,
                this.modifyEquipmentImageFile
            );

            this.toastService.show('Modified successfully', false);
            this.onModifyEquipmentModalclose();
        } catch (error) {
            this.toastService.show('Modification error', true);
            this.onModifyEquipmentModalclose();
        }
    }

    // ---------- Deleting Equipment Logic ----------
    async onEquipmentDelete() {
        try {
            this.adminService.deleteEquipment(
                this.modifyEquipmentId,
                this.modifyEquipmentImageFilePath
            );

            this.toastService.show('Deleted successfully', false);
            this.onModifyEquipmentModalclose();
        } catch (error) {
            this.toastService.show('Deletion error', true);
            this.onModifyEquipmentModalclose();
        }
    }
}

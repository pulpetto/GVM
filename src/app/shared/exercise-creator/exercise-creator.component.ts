import { Component, ElementRef, ViewChild } from '@angular/core';
import { InstructionStepsComponent } from './instruction-steps/instruction-steps.component';
import { EquipmentSelectorComponent } from './equipment-selector/equipment-selector.component';

@Component({
    selector: 'app-exercise-creator',
    standalone: true,
    imports: [InstructionStepsComponent, EquipmentSelectorComponent],
    templateUrl: './exercise-creator.component.html',
    styleUrl: './exercise-creator.component.css',
})
export class ExerciseCreatorComponent {
    @ViewChild('thumbnail') thumbnailInput!: ElementRef<HTMLInputElement>;
    @ViewChild('video') videoInput!: ElementRef<HTMLInputElement>;

    selectedThumbnail: string | ArrayBuffer | null = null;
    selectedVideo: string | ArrayBuffer | null = null;

    onThumbnailSelect() {
        if (this.thumbnailInput.nativeElement.files) {
            const thumbnail = this.thumbnailInput.nativeElement.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                this.selectedThumbnail = reader.result;
            };

            reader.readAsDataURL(thumbnail);
        }
    }

    removeThumbnail() {
        this.selectedThumbnail = null;
    }

    onVideoSelect() {
        if (this.videoInput.nativeElement.files) {
            const video = this.videoInput.nativeElement.files[0];
            const reader = new FileReader();

            reader.onload = () => {
                this.selectedVideo = reader.result;
            };

            reader.readAsDataURL(video);
        }
    }

    removeVideo() {
        this.selectedVideo = null;
    }
}

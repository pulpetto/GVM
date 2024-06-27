import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-name-editor',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './name-editor.component.html',
    styleUrl: './name-editor.component.css',
})
export class NameEditorComponent {
    nameEditMode: boolean = false;
    previousTitle: string = 'My Workout 1';
    title: string = 'My Workout 1';

    @ViewChild('inputRef') inputEl!: ElementRef;

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.cancelNewTitle();
        }

        if (event.key === 'Enter') {
            this.updateTitle();
        }
    }

    openTitleEditMode() {
        this.nameEditMode = true;
        this.title = '';

        setTimeout(() => {
            this.inputEl.nativeElement.focus();
        }, 0);
    }

    cancelNewTitle() {
        this.nameEditMode = false;
        this.title = this.previousTitle;
    }

    updateTitle() {
        this.nameEditMode = false;
        this.previousTitle = this.title;
    }
}

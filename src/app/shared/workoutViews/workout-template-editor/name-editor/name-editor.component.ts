import {
    Component,
    ElementRef,
    HostListener,
    Input,
    ViewChild,
} from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-name-editor',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './name-editor.component.html',
    styleUrl: './name-editor.component.css',
})
export class NameEditorComponent {
    @Input({ required: true }) title!: FormControl;

    previousTitle!: string;
    editMode: boolean = false;

    @ViewChild('inputRef') inputEl!: ElementRef;

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Escape' && this.editMode) {
            this.cancelNewTitle();
        }

        if (event.key === 'Enter') {
            this.updateTitle();
        }
    }

    openTitleEditMode() {
        this.editMode = true;
        this.previousTitle = this.title.value;
        this.title.setValue('');

        setTimeout(() => {
            this.inputEl.nativeElement.focus();
        }, 0);
    }

    cancelNewTitle() {
        this.editMode = false;
        this.title.setValue(this.previousTitle);
    }

    updateTitle() {
        this.editMode = false;
        this.previousTitle = this.title.value;
    }
}

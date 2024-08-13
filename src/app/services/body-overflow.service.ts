import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class BodyOverflowService {
    constructor(
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document
    ) {}

    enableOverflowY() {
        this.renderer.addClass(this.document.body, 'overflow-y-hidden');
    }

    disableOverflowY() {
        this.renderer.removeClass(this.document.body, 'overflow-y-hidden');
    }
}

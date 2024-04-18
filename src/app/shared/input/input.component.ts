import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [NgxMaskDirective],
    templateUrl: './input.component.html',
    styleUrl: './input.component.css',
    providers: [provideNgxMask()],
})
export class InputComponent implements OnInit {
    @Input({ required: true }) type!: string;
    @Input({ required: true }) label!: string;
    @Input() formControl!: string;
    @Input() inputMask!: string;
    id!: string;

    @ViewChild('inputElement') inputRef!: ElementRef;

    ngOnInit() {
        // prettier-ignore
        this.id = new Array(5).join().replace(/(.|$)/g, function(){return ((Math.random()*36)|0).toString(36)[Math.random()<.5?"toString":"toUpperCase"]();});
    }

    focusOnInput() {
        console.log('h');
        this.inputRef.nativeElement.focus();
    }
}

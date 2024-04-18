import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [],
    templateUrl: './input.component.html',
    styleUrl: './input.component.css',
})
export class InputComponent implements OnInit {
    @Input({ required: true }) type!: string;
    @Input({ required: true }) label!: string;
    id!: string;

    ngOnInit() {
        // prettier-ignore
        this.id = new Array(5).join().replace(/(.|$)/g, function(){return ((Math.random()*36)|0).toString(36)[Math.random()<.5?"toString":"toUpperCase"]();});
    }
}

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterModule, HeaderComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {
    words = ['partner', 'tracker', 'buddy', 'assistant', 'coach', 'instructor'];
    activeWordIndex: number = 0;
    // eslint-disable-next-line
    interval!: any;

    @ViewChild('myElement') myElement!: ElementRef;

    ngAfterViewInit() {
        const threshold = 0.2;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.interval = setInterval(() => {
                            if (
                                this.activeWordIndex + 1 ===
                                this.words.length
                            ) {
                                this.activeWordIndex = 0;
                            } else {
                                this.activeWordIndex++;
                            }
                        }, 2000);
                    } else {
                        clearInterval(this.interval);
                    }
                });
            },
            { threshold }
        );

        observer.observe(this.myElement.nativeElement);
    }
}

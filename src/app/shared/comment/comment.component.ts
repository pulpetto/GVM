import { Component, Input } from '@angular/core';
import { User } from '../../interfaces/user';

@Component({
    selector: 'app-comment',
    standalone: true,
    imports: [],
    templateUrl: './comment.component.html',
    styleUrl: './comment.component.css',
})
export class CommentComponent {
    @Input() content!: string;
    @Input() dateUnix!: number;
    @Input() user!: User;
}

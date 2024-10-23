import { Component, inject, OnInit } from '@angular/core';
import { ChartsCarouselComponent } from '../charts-carousel/charts-carousel.component';
import { TabsComponent } from '../tabs/tabs.component';
import { InstructionComponent } from './instruction/instruction.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Observable } from 'rxjs';
import { ExercisePreview } from '../../interfaces/exercise-preview';
import { ExerciseDetails } from '../../interfaces/exercise-details';

@Component({
    selector: 'app-exercise',
    standalone: true,
    templateUrl: './exercise.component.html',
    styleUrl: './exercise.component.css',
    imports: [
        ChartsCarouselComponent,
        TabsComponent,
        InstructionComponent,
        RouterModule,
        CommonModule,
    ],
})
export class ExerciseComponent implements OnInit {
    dataService = inject(DataService);
    activatedRoute = inject(ActivatedRoute);

    exerciseBaseData$!: Observable<ExercisePreview>;
    exerciseDetails$!: Observable<ExerciseDetails>;

    ngOnInit() {
        const exerciseId = this.activatedRoute.snapshot.paramMap.get('id');

        this.exerciseBaseData$ = this.dataService.getExercisePreview$(
            exerciseId!
        );

        this.exerciseDetails$ = this.dataService.getExerciseDetails$(
            exerciseId!
        );
    }
}

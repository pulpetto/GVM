import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseChartsComponent } from './exercise-charts.component';

describe('ExerciseChartsComponent', () => {
  let component: ExerciseChartsComponent;
  let fixture: ComponentFixture<ExerciseChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseChartsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExerciseChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

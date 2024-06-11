import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseEditModeComponent } from './exercise-edit-mode.component';

describe('ExerciseEditModeComponent', () => {
  let component: ExerciseEditModeComponent;
  let fixture: ComponentFixture<ExerciseEditModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseEditModeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExerciseEditModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

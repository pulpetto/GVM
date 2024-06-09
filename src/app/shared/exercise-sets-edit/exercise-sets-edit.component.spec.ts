import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseSetsEditComponent } from './exercise-sets-edit.component';

describe('ExerciseSetsEditComponent', () => {
  let component: ExerciseSetsEditComponent;
  let fixture: ComponentFixture<ExerciseSetsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseSetsEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExerciseSetsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

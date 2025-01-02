import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomExerciseCreatorComponent } from './custom-exercise-creator.component';

describe('CustomExerciseCreatorComponent', () => {
  let component: CustomExerciseCreatorComponent;
  let fixture: ComponentFixture<CustomExerciseCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomExerciseCreatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomExerciseCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutTemplatePreviewComponent } from './workout-template-preview.component';

describe('WorkoutTemplatePreviewComponent', () => {
  let component: WorkoutTemplatePreviewComponent;
  let fixture: ComponentFixture<WorkoutTemplatePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutTemplatePreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkoutTemplatePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

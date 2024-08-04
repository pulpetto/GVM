import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutTemplateEditorComponent } from './workout-template-editor.component';

describe('WorkoutTemplateEditorComponent', () => {
  let component: WorkoutTemplateEditorComponent;
  let fixture: ComponentFixture<WorkoutTemplateEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutTemplateEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkoutTemplateEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

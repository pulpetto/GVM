import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutTemplateFullViewComponent } from './workout-template-full-view.component';

describe('WorkoutTemplateFullViewComponent', () => {
  let component: WorkoutTemplateFullViewComponent;
  let fixture: ComponentFixture<WorkoutTemplateFullViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutTemplateFullViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkoutTemplateFullViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

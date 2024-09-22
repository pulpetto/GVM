import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubStepComponent } from './sub-step.component';

describe('SubStepComponent', () => {
  let component: SubStepComponent;
  let fixture: ComponentFixture<SubStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubStepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

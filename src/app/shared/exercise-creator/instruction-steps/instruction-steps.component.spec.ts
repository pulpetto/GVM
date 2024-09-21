import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionStepsComponent } from './instruction-steps.component';

describe('InstructionStepsComponent', () => {
  let component: InstructionStepsComponent;
  let fixture: ComponentFixture<InstructionStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstructionStepsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstructionStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodModalComponent } from './period-modal.component';

describe('PeriodModalComponent', () => {
  let component: PeriodModalComponent;
  let fixture: ComponentFixture<PeriodModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeriodModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

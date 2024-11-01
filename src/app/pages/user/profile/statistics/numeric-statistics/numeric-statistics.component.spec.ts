import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumericStatisticsComponent } from './numeric-statistics.component';

describe('NumericStatisticsComponent', () => {
  let component: NumericStatisticsComponent;
  let fixture: ComponentFixture<NumericStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumericStatisticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NumericStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

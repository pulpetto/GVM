import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDatePickerComponent } from './calendar-date-picker.component';

describe('CalendarDatePickerComponent', () => {
  let component: CalendarDatePickerComponent;
  let fixture: ComponentFixture<CalendarDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarDatePickerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

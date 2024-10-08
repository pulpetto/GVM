import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartDateModalComponent } from './start-date-modal.component';

describe('StartDateModalComponent', () => {
  let component: StartDateModalComponent;
  let fixture: ComponentFixture<StartDateModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartDateModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StartDateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

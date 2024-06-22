import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonForRpeModalComponent } from './button-for-rpe-modal.component';

describe('ButtonForRpeModalComponent', () => {
  let component: ButtonForRpeModalComponent;
  let fixture: ComponentFixture<ButtonForRpeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonForRpeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonForRpeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

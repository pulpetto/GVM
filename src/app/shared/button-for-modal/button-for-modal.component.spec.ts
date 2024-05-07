import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonForModalComponent } from './button-for-modal.component';

describe('ButtonForModalComponent', () => {
  let component: ButtonForModalComponent;
  let fixture: ComponentFixture<ButtonForModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonForModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonForModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

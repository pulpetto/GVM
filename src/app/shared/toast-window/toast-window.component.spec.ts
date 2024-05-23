import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastWindowComponent } from './toast-window.component';

describe('ToastWindowComponent', () => {
  let component: ToastWindowComponent;
  let fixture: ComponentFixture<ToastWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastWindowComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToastWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

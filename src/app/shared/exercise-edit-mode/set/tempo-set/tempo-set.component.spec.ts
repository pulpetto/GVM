import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TempoSetComponent } from './tempo-set.component';

describe('TempoSetComponent', () => {
  let component: TempoSetComponent;
  let fixture: ComponentFixture<TempoSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempoSetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TempoSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropSetComponent } from './drop-set.component';

describe('DropSetComponent', () => {
  let component: DropSetComponent;
  let fixture: ComponentFixture<DropSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropSetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollSnapSelectorComponent } from './scroll-snap-selector.component';

describe('ScrollSnapSelectorComponent', () => {
  let component: ScrollSnapSelectorComponent;
  let fixture: ComponentFixture<ScrollSnapSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollSnapSelectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScrollSnapSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

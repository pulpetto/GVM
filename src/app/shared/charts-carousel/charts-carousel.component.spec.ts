import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsCarouselComponent } from './charts-carousel.component';

describe('ChartsCarouselComponent', () => {
  let component: ChartsCarouselComponent;
  let fixture: ComponentFixture<ChartsCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartsCarouselComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

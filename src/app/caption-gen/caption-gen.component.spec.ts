import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptionGenComponent } from './caption-gen.component';

describe('CaptionGenComponent', () => {
  let component: CaptionGenComponent;
  let fixture: ComponentFixture<CaptionGenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaptionGenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaptionGenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

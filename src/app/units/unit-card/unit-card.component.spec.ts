import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitCardComponent } from './unit-card.component';

describe('UnitCardComponent', () => {
  let component: UnitCardComponent;
  let fixture: ComponentFixture<UnitCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

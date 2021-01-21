import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitOptionsComponent } from './unit-options.component';

describe('UnitOptionsComponent', () => {
  let component: UnitOptionsComponent;
  let fixture: ComponentFixture<UnitOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

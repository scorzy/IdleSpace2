import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTabsComponent } from './unit-tabs.component';

describe('UnitTabsComponent', () => {
  let component: UnitTabsComponent;
  let fixture: ComponentFixture<UnitTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

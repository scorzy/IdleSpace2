import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoRefreshComponent } from './auto-refresh.component';

describe('AutoRefreshComponent', () => {
  let component: AutoRefreshComponent;
  let fixture: ComponentFixture<AutoRefreshComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoRefreshComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoRefreshComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

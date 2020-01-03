import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleReportComponent } from './battle-report.component';

describe('BattleReportComponent', () => {
  let component: BattleReportComponent;
  let fixture: ComponentFixture<BattleReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

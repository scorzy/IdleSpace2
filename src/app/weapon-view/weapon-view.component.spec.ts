import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeaponViewComponent } from './weapon-view.component';

describe('WeaponViewComponent', () => {
  let component: WeaponViewComponent;
  let fixture: ComponentFixture<WeaponViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeaponViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeaponViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

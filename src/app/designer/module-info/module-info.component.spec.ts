import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleInfoComponent } from './module-info.component';

describe('ModuleInfoComponent', () => {
  let component: ModuleInfoComponent;
  let fixture: ComponentFixture<ModuleInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

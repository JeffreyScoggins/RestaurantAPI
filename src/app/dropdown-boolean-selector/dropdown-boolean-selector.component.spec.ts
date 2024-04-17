import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownBooleanSelectorComponent } from './dropdown-boolean-selector.component';

describe('DropdownBooleanSelectorComponent', () => {
  let component: DropdownBooleanSelectorComponent;
  let fixture: ComponentFixture<DropdownBooleanSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownBooleanSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownBooleanSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

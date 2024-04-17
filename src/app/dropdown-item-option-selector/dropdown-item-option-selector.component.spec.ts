import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownItemOptionSelectorComponent } from './dropdown-item-option-selector.component';

describe('DropdownItemOptionSelectorComponent', () => {
  let component: DropdownItemOptionSelectorComponent;
  let fixture: ComponentFixture<DropdownItemOptionSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownItemOptionSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownItemOptionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

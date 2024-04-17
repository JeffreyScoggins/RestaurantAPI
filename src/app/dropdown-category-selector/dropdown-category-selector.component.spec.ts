import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownCategorySelectorComponent } from './dropdown-language-selector.component';

describe('DropdownCategorySelectorComponent', () => {
  let component: DropdownCategorySelectorComponent;
  let fixture: ComponentFixture<DropdownCategorySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownCategorySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownCategorySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

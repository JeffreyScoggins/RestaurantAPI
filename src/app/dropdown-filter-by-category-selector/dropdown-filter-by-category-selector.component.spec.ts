import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownFilterByCategorySelectorComponent } from './dropdown-filter-by-category-selector.component';

describe('DropdownFilterByCategorySelectorComponent', () => {
  let component: DropdownFilterByCategorySelectorComponent;
  let fixture: ComponentFixture<DropdownFilterByCategorySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownFilterByCategorySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownFilterByCategorySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

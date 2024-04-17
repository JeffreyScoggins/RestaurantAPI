import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownCategoriesComponent } from './dropdown-categories.component';

describe('DropdownUserRolesComponent', () => {
  let component: DropdownCategoriesComponent;
  let fixture: ComponentFixture<DropdownCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

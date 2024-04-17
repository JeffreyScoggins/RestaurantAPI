import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownUserRolesComponent } from './dropdown-user-roles.component';

describe('DropdownUserRolesComponent', () => {
  let component: DropdownUserRolesComponent;
  let fixture: ComponentFixture<DropdownUserRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownUserRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownUserRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

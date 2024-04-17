import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownTableSelectorComponent } from './dropdown-table-selector.component';

describe('DropdownTableSelectorComponent', () => {
  let component: DropdownTableSelectorComponent;
  let fixture: ComponentFixture<DropdownTableSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownTableSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownTableSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownFilterByItemSelectorComponent } from './dropdown-filter-by-item-selector.component';

describe('DropdownFilterByItemSelectorComponent', () => {
  let component: DropdownFilterByItemSelectorComponent;
  let fixture: ComponentFixture<DropdownFilterByItemSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownFilterByItemSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownFilterByItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

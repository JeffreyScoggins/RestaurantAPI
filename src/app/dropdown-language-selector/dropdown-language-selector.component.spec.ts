import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownLanguageSelectorComponent } from './dropdown-language-selector.component';

describe('DropdownLanguageSelectorComponent', () => {
  let component: DropdownLanguageSelectorComponent;
  let fixture: ComponentFixture<DropdownLanguageSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownLanguageSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownLanguageSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

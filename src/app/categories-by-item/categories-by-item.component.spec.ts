import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriesByItemComponent } from './categories-by-item.component';

describe('CategoriesByItemComponent', () => {
  let component: CategoriesByItemComponent;
  let fixture: ComponentFixture<CategoriesByItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoriesByItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesByItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

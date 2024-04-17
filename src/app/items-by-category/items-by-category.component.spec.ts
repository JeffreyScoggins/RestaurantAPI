import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsByCategoryComponent } from './items-by-category.component';

describe('ItemsByCategoryComponent', () => {
  let component: ItemsByCategoryComponent;
  let fixture: ComponentFixture<ItemsByCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsByCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemOptionsDialogComponentComponent } from './item-options-dialog-component.component';

describe('ItemOptionsDialogComponentComponent', () => {
  let component: ItemOptionsDialogComponentComponent;
  let fixture: ComponentFixture<ItemOptionsDialogComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemOptionsDialogComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemOptionsDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

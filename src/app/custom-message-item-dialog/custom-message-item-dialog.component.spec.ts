import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMessageItemDialogComponent } from './custom-message-item-dialog.component';

describe('CustomMessageItemDialogComponent', () => {
  let component: CustomMessageItemDialogComponent;
  let fixture: ComponentFixture<CustomMessageItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomMessageItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMessageItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

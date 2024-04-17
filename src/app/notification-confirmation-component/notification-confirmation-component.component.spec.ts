import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationConfirmationComponentComponent } from './notification-confirmation-component.component';

describe('NotificationConfirmationComponentComponent', () => {
  let component: NotificationConfirmationComponentComponent;
  let fixture: ComponentFixture<NotificationConfirmationComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationConfirmationComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationConfirmationComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

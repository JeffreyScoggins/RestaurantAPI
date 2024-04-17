import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterReadyOrderViewComponent } from './waiter-ready-order-view.component';

describe('WaiterReadyOrderViewComponent', () => {
  let component: WaiterReadyOrderViewComponent;
  let fixture: ComponentFixture<WaiterReadyOrderViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiterReadyOrderViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiterReadyOrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

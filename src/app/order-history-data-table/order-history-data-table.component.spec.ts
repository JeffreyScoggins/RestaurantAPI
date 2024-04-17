import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryDataTableComponent } from './order-history-data-table.component';

describe('OrderHistoryDataTableComponent', () => {
  let component: OrderHistoryDataTableComponent;
  let fixture: ComponentFixture<OrderHistoryDataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderHistoryDataTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoryDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

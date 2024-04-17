import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterRequestViewComponent } from './waiter-request-view.component';

describe('WaiterRequestViewComponent', () => {
  let component: WaiterRequestViewComponent;
  let fixture: ComponentFixture<WaiterRequestViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiterRequestViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiterRequestViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

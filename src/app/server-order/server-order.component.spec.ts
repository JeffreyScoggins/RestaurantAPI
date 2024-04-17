import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerOrderComponent } from './server-order.component';

describe('ServerOrderComponent', () => {
  let component: ServerOrderComponent;
  let fixture: ComponentFixture<ServerOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOfUserAccountsComponent } from './chart-of-user-accounts.component';

describe('ChartOfUserAccountsComponent', () => {
  let component: ChartOfUserAccountsComponent;
  let fixture: ComponentFixture<ChartOfUserAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartOfUserAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOfUserAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMoneyComponent } from './send-money.component';

describe('SendMoneyComponent', () => {
  let component: SendMoneyComponent;
  let fixture: ComponentFixture<SendMoneyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SendMoneyComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

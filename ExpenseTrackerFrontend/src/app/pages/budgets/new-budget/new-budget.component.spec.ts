import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBudgetComponent } from './new-budget.component';

describe('NewBudgetComponent', () => {
  let component: NewBudgetComponent;
  let fixture: ComponentFixture<NewBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBudgetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

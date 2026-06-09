
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { BudgetModel } from 'src/app/models/BudgetModel';
import { Moment } from 'moment';
import { FormControl } from '@angular/forms';

export const MONTH_YEAR_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MMM YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-budget-form',
  templateUrl: './budget-form.component.html',
  styleUrls: ['../expense-form/expense-form.component.scss', './budget-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS }
  ]
})
export class BudgetFormComponent implements OnInit {
  @Input() budget: BudgetModel = [] as any;
  @Input() actions = {
    edit: false,
    save: false,
    cancel: false,
    delete: false
  };
  @Output() save = new EventEmitter<BudgetModel>();
  @Output() edit = new EventEmitter<BudgetModel>();
  @Output() cancel = new EventEmitter<BudgetModel>();
  @Output() delete = new EventEmitter<BudgetModel>();

  selectedDate = new FormControl<Date | null>(this.budget.budgetMonth);
  chosenYear: number | undefined = this.selectedDate.getRawValue()?.getFullYear();
  chosenMonth: number | undefined = this.selectedDate.getRawValue()?.getMonth();

  constructor() { }

  ngOnInit(): void {
    this.selectedDate.setValue(this.budget.budgetMonth);
  }

  setMonthAndYear(event: any, datepicker: any) {
    this.selectedDate.setValue(event.value);
    datepicker.close();
  }

  chosenYearHandler(normalizedYear: Moment) {
    this.chosenYear = normalizedYear.year(); // Extract the year from the selected date
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: any) {
    const year = this.chosenYear ?? new Date().getFullYear();
    const month = normalizedMonth.month();
    const newDate = new Date(year, month, 1);

    this.selectedDate.setValue(newDate);
    this.budget.budgetMonth = new Date(year, month + 1, 1);
    datepicker.close();
  }

  public isNewForm(): boolean {
    return this.budget.id === undefined || this.budget.id === 0;
  }

  public monthFormatter(): string {
    if (!this.budget || !this.budget.budgetMonth) return '';
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'long'
    }).format(this.budget.budgetMonth);
  }
}
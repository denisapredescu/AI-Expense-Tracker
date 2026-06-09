import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { ExpenseModel } from 'src/app/models/ExpenseModel';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

export const DAY_MONTH_YEAR_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DAY_MONTH_YEAR_FORMATS }
  ]
})
export class ExpenseFormComponent {
  @Input() expense: ExpenseModel = [] as any;
  @Input() categories: CategoryModel[] = [];
  @Input() actions = {
    edit: false,
    save: false,
    cancel: false,
    delete: false
  };

  @Output() save = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  constructor() { }

  public isNewForm(): boolean {
    return this.expense.id === 0 || this.expense.id === undefined;
  }
}

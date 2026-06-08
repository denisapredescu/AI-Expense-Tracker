import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { ExpenseModel } from 'src/app/models/ExpenseModel';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { BudgetModel } from 'src/app/models/BudgetModel';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { Moment } from 'moment';

// export const DAY_MONTH_YEAR_FORMATS = {
//   parse: {
//     dateInput: 'DD/MM/YYYY',
//   },
//   display: {
//     dateInput: 'DD/MM/YYYY'
//   },
// };

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
  // @Input() budget: BudgetModel | undefined = undefined;

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

    // currentMonth: string = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  // selectedDate = new Date();
  //   chosenYear: number | undefined = this.selectedDate.getFullYear();
  //   chosenMonth: number | undefined = this.selectedDate.getMonth();
  

constructor() { }

//  setMonthAndYear(event: any, datepicker: any) {
    
//     datepicker.close();
//   }

//   chosenYearHandler(normalizedYear: Moment) {
//     this.budget!.year = normalizedYear.year(); // Extract the year from the selected date
//   }

//   chosenMonthHandler(normalizedMonth: Moment, datepicker: any) {
//     this.budget!.year = this.budget!.year  ?? new Date().getFullYear();
//     this.budget!.month = normalizedMonth.month();
//     const newDate = new Date(this.budget!.year, this.budget!.month, 1);

//     this.budget!.budgetMonth = newDate;
//     datepicker.close();

//     console.log('Selected:', this.budget!.budgetMonth);
//   }

// Source - https://stackoverflow.com/a/37511166
// Posted by Günter Zöchbauer, modified by community. See post 'Timeline' for change history
// Retrieved 2026-06-01, License - CC BY-SA 4.0

// public isEditing(): boolean | undefined {
//   if (this.expense && this.budget === undefined)
//     return this.expense.isEditing;
//   else if (this.budget && this.expense === undefined)
//     return this.budget.isEditing;
//   else
//     return false;
// }

public isNewForm(): boolean {
 // if (this.expense && this.budget === undefined)
    return this.expense.id === 0 || this.expense.id === undefined;
  // else if (this.budget && this.expense === undefined)
  //   return this.budget.id === undefined || this.budget.id === 0;
  // else
  //   return false;

}
}

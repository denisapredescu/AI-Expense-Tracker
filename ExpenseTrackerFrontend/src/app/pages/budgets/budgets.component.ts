
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import { BudgetsService } from 'src/app/services/budgets.service';
import { BudgetModel } from 'src/app/models/BudgetModel';

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
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS }
  ]
})

export class BudgetsComponent implements OnInit {
  constructor(
    private budgetsService: BudgetsService,
    private sharedDataService: SharedDataService
  ) { }

  budgets: BudgetModel[] = [];
  allBudgets: BudgetModel[] = [];
  newSectionIsOpen: boolean = false;
  categories: CategoryModel[] = [];
  public currentMonth: string = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  selectedDate = new FormControl<Date | null>(null);
  chosenYear: number | null = null;
  chosenMonth: number | null = null;

  setMonthAndYear(event: any, datepicker: any) {
    this.selectedDate.setValue(event.value);
    datepicker.close();
  }

  chosenYearHandler(normalizedYear: Moment) {
    console.log('Chosen Year:', normalizedYear);
    this.chosenYear = normalizedYear.year(); // Extract the year from the selected date
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: any) {
    const year = this.chosenYear ?? new Date().getFullYear();
    const month = normalizedMonth.month();
    const newDate = new Date(year, month, 1);
    this.selectedDate.setValue(newDate);

    datepicker.close();

    this.budgets = this.allBudgets.filter(bud => {
      if (!bud.budgetMonth) return false;

      const selected = this.selectedDate.value;

      if (!selected) return true;

      return (
        bud.budgetMonth.getFullYear() === selected.getFullYear() &&
        bud.budgetMonth.getMonth() === selected.getMonth()
      );
    });
  }

  resetDateSelector() {
    this.selectedDate.setValue(null);
    this.chosenYear = null;
    this.chosenMonth = null;
    this.budgets = [...this.allBudgets];
    console.log('Resetting:', this.budgets);
    this.selectedCategoryId = 0; // Reset category filter as well
    this.sortBy = 'dateDesc'; // Reset sorting to default
    this.applySort();
  }

  selectedCategoryId: number = 0; // 0 will represent "All" categories

  ngOnInit() {
    this.budgetsService.getAll(this.sharedDataService.currentEmail).subscribe(res => {
      this.budgets = res;
      this.budgets.map(r => r.budgetMonth = new Date(r.budgetMonth));
      this.allBudgets = [...this.budgets];
      this.applySort();
    });
  }

  filterBudgetsByMonthAndYear() {
    this.budgets = this.allBudgets.filter(bud => {
      if (!bud.budgetMonth) return false;

      const selected = this.selectedDate.value;

      if (!selected) return true;

      return (
        bud.budgetMonth.getFullYear() === selected.getFullYear() &&
        bud.budgetMonth.getMonth() === selected.getMonth()
      );
    });
  }

  removeExpenseFromUI(index: number) {
    this.budgets.splice(index, 1);
  }

  removeExpense(bud: BudgetModel) {
    // Assuming you have a delete endpoint in your BudgetsService
    this.budgetsService.deleteBudget(bud.id || 0).subscribe(res => {
      console.log('Budget removed from server', res);
      var index = this.budgets.findIndex(b => b.id === bud.id);
      if (index !== -1) {
        this.removeExpenseFromUI(index); // Remove from local array after successful deletion
      }
    }, error => {
      console.error('Error removing budget:', error);
    });
  }

  enableEdit(bud: BudgetModel) {
    bud.isEditing = true;
    bud.originalBudget = { ...bud };
  }

  saveBudget(bud: BudgetModel) {
    console.log("Saving:", bud);
    bud.isSaving = true;

    this.budgetsService.updateBudget(bud).subscribe((response: BudgetModel[]) => {
      bud.isEditing = false;
      bud.isSaving = false;
      bud.originalBudget = undefined;
      this.budgets = response;
    },
      (error) => {
        console.log(error);
        bud.isSaving = false;
      }
    );
  }

  restoreExpense(bud: BudgetModel) {
    if (!bud.originalBudget) return;

    bud.monthlyLimit = bud.originalBudget.monthlyLimit;
    bud.budgetMonth = bud.originalBudget.budgetMonth;
    bud.isEditing = false;
  }

  sortBy: string = 'dateDesc';

  applySort() {
    switch (this.sortBy) {
      case 'dateDesc':
        this.budgets.sort((a, b) =>
          new Date(b.budgetMonth).getTime() - new Date(a.budgetMonth).getTime()
        );
        break;

      case 'dateAsc':
        this.budgets.sort((a, b) =>
          new Date(a.budgetMonth).getTime() - new Date(b.budgetMonth).getTime()
        );
        break;

      case 'amountDesc':
        this.budgets.sort((a, b) => b.monthlyLimit - a.monthlyLimit);
        break;

      case 'amountAsc':
        this.budgets.sort((a, b) => a.monthlyLimit - b.monthlyLimit);
        break;
    }

  }
  updateBudgets(budgets: BudgetModel[]) {
    this.budgets = budgets;
    this.allBudgets = [...budgets];
    //   this.filterAndSortExpenses();
    // }
  }

}

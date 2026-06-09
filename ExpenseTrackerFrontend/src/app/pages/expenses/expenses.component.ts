import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { ExpenseModel } from 'src/app/models/ExpenseModel';
import { AiServiceService } from 'src/app/services/ai-service.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ExpensesService } from 'src/app/services/expenses.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS }
  ]
})
export class ExpensesComponent implements OnInit {
  constructor(private aiService: AiServiceService,
    private expensesService: ExpensesService,
    private categoryService: CategoriesService,
    private sharedDataService: SharedDataService,
    private snackbar: MatSnackBar
  ) { }

  expenses: ExpenseModel[] = [];
  allExpenses: ExpenseModel[] = [];
  newSectionIsOpen: boolean = false;
  categories: CategoryModel[] = [];
  currentMonth: string = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  selectedDate = new FormControl<Date | null>(null);
  chosenYear: number | null = null;
  chosenMonth: number | null = null;
  selectedCategoryId: number = 0; // 0 will represent "All" categories

  ngOnInit() {
    this.categoryService.getAll().subscribe(res => {
      this.categories = res;
      console.log('Categories loaded:', this.categories);
    });

    this.expensesService.getAll(this.sharedDataService.currentEmail).subscribe(res => {
      this.expenses = res;
      this.allExpenses = [...res];
      console.log('Expenses loaded:', this.expenses);
      this.applySort();
    }, error => {
      console.error('Error loading expenses:', error);
      this.snackbar.open('Failed to load expenses. Please try again later.', 'Close', {
        duration: 3000
      });
    });
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
    datepicker.close();

    this.filterAndSortExpenses();
  }

  resetDateSelector() {
    this.selectedDate.setValue(null);
    this.chosenYear = null;
    this.chosenMonth = null;
    this.expenses = [...this.allExpenses];
    this.selectedCategoryId = 0; // Reset category filter as well
    this.sortBy = 'dateDesc'; // Reset sorting to default
    this.applySort();
  }

  filterAndSortExpenses() {
    this.expenses = [...this.allExpenses];
    this.filterByPaymentDate(this.selectedDate.value);
    this.filterByCategory();
    this.applySort();
  }

  filterByPaymentDate(selectedDate: Date | null) {
    if (!selectedDate) {
      return;
    }

    this.expenses = this.expenses.filter(exp => {
      if (!exp.paymentDate) return false;
      const expDate = new Date(exp.paymentDate);
      if (isNaN(expDate.getTime())) return false;
      return (
        expDate.getFullYear() === selectedDate.getFullYear() &&
        expDate.getMonth() === selectedDate.getMonth()
      );
    });
  }

  filterByCategory() {
    if (this.selectedCategoryId === 0) {
      return;
    }
    this.expenses = this.expenses.filter(expense => expense.categoryId === this.selectedCategoryId);
  }

  removeExpenseFromUI(index: number) {
    this.expenses.splice(index, 1);
  }

  removeExpense(expense: ExpenseModel) {
    // Assuming you have a delete endpoint in your ExpensesService
    this.expensesService.deleteExpense(expense).subscribe(res => {
      var index = this.expenses.findIndex(e => e.id === expense.id);
      if (index !== -1) {
        this.removeExpenseFromUI(index); // Remove from local array after successful deletion
      }
    }, error => {
      console.error('Error removing expense:', error);
    });
  }

  enableEdit(exp: ExpenseModel) {
    exp.isEditing = true;
    exp.originalExpense = { ...exp };
  }

  saveExpense(exp: ExpenseModel) {
    exp.isSaving = true;
    this.expensesService.updateExpense(exp).subscribe(
      res => {
        exp.isEditing = false;
        exp.isSaving = false;
        exp.originalExpense = undefined;

        this.expenses = res;
        this.allExpenses = [...res];
        this.applySort();
      }, error => {
        console.log(error);
        exp.isSaving = false;
      }
    );
  }

  restoreExpense(exp: ExpenseModel) {
    if (!exp.originalExpense) return;

    exp.categoryId = exp.originalExpense.categoryId;
    exp.amount = exp.originalExpense.amount;
    exp.currency = exp.originalExpense.currency;
    exp.paymentMethod = exp.originalExpense.paymentMethod;
    exp.paymentDate = exp.originalExpense.paymentDate;
    exp.merchant = exp.originalExpense.merchant;
    exp.description = exp.originalExpense.description;
    exp.isEditing = false;
  }

  sortBy: string = 'dateDesc';

  applySort() {
    switch (this.sortBy) {
      case 'dateDesc':
        this.expenses.sort((a, b) =>
          new Date(b.paymentDate || '').getTime() - new Date(a.paymentDate || '').getTime()
        );
        break;

      case 'dateAsc':
        this.expenses.sort((a, b) =>
          new Date(a.paymentDate || '').getTime() - new Date(b.paymentDate || '').getTime()
        );
        break;

      case 'amountDesc':
        this.expenses.sort((a, b) => b.amount - a.amount);
        break;

      case 'amountAsc':
        this.expenses.sort((a, b) => a.amount - b.amount);
        break;

      case 'merchantAsc':
        this.expenses.sort((a, b) =>
          (a.merchant || '').localeCompare(b.merchant || '')
        );
        break;
    }
  }

  updateExpenses(expenses: ExpenseModel[]) {
    this.expenses = expenses;
    this.allExpenses = [...expenses];
    this.filterAndSortExpenses();
  }
}

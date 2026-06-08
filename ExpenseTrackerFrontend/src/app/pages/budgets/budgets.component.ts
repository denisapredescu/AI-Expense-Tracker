
import { Component, OnInit } from '@angular/core';
import { FormControl, NgModel } from '@angular/forms';
import { AiExpenseModel } from 'src/app/models/AiExpenseModel';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { ExpenseModel } from 'src/app/models/ExpenseModel';
import { AiServiceService } from 'src/app/services/ai-service.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ExpensesService } from 'src/app/services/expenses.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { isNullOrUndef } from 'chart.js/dist/helpers/helpers.core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
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
  constructor(private aiService: AiServiceService,
    private budgetsService: BudgetsService,
    private categoryService: CategoriesService,
    private sharedDataService: SharedDataService,
    private router: Router
  ) { }
  
  // value: string = '';
  budgets: BudgetModel[] = [];
 allBudgets: BudgetModel[] = [];
newSectionIsOpen: boolean = false;
  categories: CategoryModel[] = [];
  // isLoading: boolean= false;

    public currentMonth: string = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  
  selectedDate = new FormControl<Date | null>(null);
  
  chosenYear: number | null = null;
  
  chosenMonth: number | null = null;
  
  setMonthAndYear(event: any, datepicker: any) {
    // this.selectedDate = event.value;
    this.selectedDate.setValue(event.value);
    datepicker.close();
    
    console.log('Selected:', this.selectedDate);
    
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
  
    console.log('Selected:', this.selectedDate);console.log('Budgets:', this.budgets);
   
  this.budgets = this.allBudgets.filter(bud => {
console.log('Filtering budget:', bud);
      if (!bud.budgetMonth) return false;
console.log('Filtering budget:', bud);


  const selected = this.selectedDate.value;
  if (!selected) return true;
console.log('Comparing budget date:', bud.budgetMonth, 'with selected date:', selected);
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

  // filterByCategory(categoryId: number) {
  //   if (categoryId === 0) {
  //     this.budgets = [...this.allBudgets]; // Return all budgets if "All" is selected
  //     return;
  //   }
  //   this.budgets = this.budgets.filter(bud => bud.categoryId === categoryId);
  // }


  ngOnInit() {
    this.budgetsService.getAll(this.sharedDataService.currentEmail).subscribe(res => {
      this.budgets = res;
      this.budgets.map(r => r.budgetMonth = new Date(r.budgetMonth));
      // console.log(new Date(this.budgets[0].budgetMonth).getFullYear());
      this.allBudgets = [...this.budgets];
      this.applySort();

// this.filterBudgetsByMonthAndYear();
      
    });



    // this.budgets = [
    // {
    //   categoryId: 1, amount: 100, currency: 'LEI',merchant:'Store',  paymentMethod: 'Cash', paymentDate: new Date('2026-05-20T00:00:00'),
    //   userEmail: 'denisa@gmail.com', isEditing: true
    // },

    // {categoryId: 2, isEditing: false ,amount: 50, currency: 'LEI',merchant:'Store',  paymentMethod: 'Cash', paymentDate: new Date('2026-05-25T00:00:00'), userEmail: 'denisa@gmail.com'},

    // {categoryId: 4, amount: 13, currency: 'LEI', paymentMethod: 'Cash', paymentDate: new Date('2026-05-23T00:00:00'), userEmail: 'denisa@gmail.com'}
    //     ];
    //     this.allBudgets = [...this.budgets];


  }
     filterBudgetsByMonthAndYear() {  
      this.budgets = this.allBudgets.filter(bud => {
console.log('Filtering budget:', bud);
      if (!bud.budgetMonth) return false;
console.log('Filtering budget:', bud);

  const selected = this.selectedDate.value;
  if (!selected) return true;
console.log('Comparing budget date:', bud.budgetMonth, 'with selected date:', selected);
  return (
    bud.budgetMonth.getFullYear() === selected.getFullYear() &&
    bud.budgetMonth.getMonth() === selected.getMonth()
  );
});}
  removeExpenseFromUI(index: number) {
    this.budgets.splice(index, 1);
  }

  removeExpense(bud: BudgetModel) {
    console.log('Removing budget with ID:', bud.id);
    
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
    // bud.isloading = true;
    console.log("Saving:", bud);
    bud.isSaving = true;
      this.budgetsService.updateBudget(bud).subscribe((response: BudgetModel[]) => 
        {
          bud.isEditing = false;
          bud.isSaving = false;
          bud.originalBudget = undefined;
          this.budgets = response;
        //   this.filterBudgetsByMonthAndYear();
        // this.applySort();
        
        //   this.router.navigate(['/budgets']);
        // bud.budgetMonth.setMonth(bud.budgetMonth.getMonth() - 1);
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
    bud.budgetMonth  = bud.originalBudget.budgetMonth;

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

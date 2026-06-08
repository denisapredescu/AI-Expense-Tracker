import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { ExpenseModel } from 'src/app/models/ExpenseModel';
import { AiServiceService } from 'src/app/services/ai-service.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ExpensesService } from 'src/app/services/expenses.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-expense',
  templateUrl: './new-expense.component.html',
  styleUrls: ['./new-expense.component.scss']
})
export class NewExpenseComponent implements OnInit  {
  
@Input() categories: CategoryModel[] = [];
@Input() expenses: ExpenseModel[] = [];
@Output() changeExpenses = new EventEmitter<ExpenseModel[]>();

   constructor(
    private router: Router,
    private aiService: AiServiceService,
      private expensesService: ExpensesService,
      private categoryService: CategoriesService,
      private sharedDataService: SharedDataService,
      private snackBar: MatSnackBar
    ) { }
     value: string = '';
      aiGeneratedExpenses: ExpenseModel[] = [];
      isLoading: boolean= false;
      error: string = "";
      newExpense: ExpenseModel = {
        id: 0,
        categoryId: 0,
        amount: 0.0,
        currency: "LEI",
        userEmail: this.sharedDataService.currentEmail , 
        isEditing: true, 
        paymentDate: new Date() 
      };
      
  ngOnInit() {
    
  }

  extract() {
     this.isLoading = true;
     this.error = "";
    this.aiService.extract(this.value).subscribe(res => {
      console.log(res);
      // this.expenses = res;
      this.aiGeneratedExpenses = res.map((e: any) => ({
        ...e,
        // paymentDate: new Date(e.paymentDate)
        paymentDate: e.paymentDate
          ? new Date(e.paymentDate)//.toISOString().split('T')[0]
          : '',
          userEmail: this.sharedDataService.currentEmail,
isEditing: true,
      }));
      console.log("Generated Expenses:", this.aiGeneratedExpenses);

      this.isLoading = false;
    }, error => {
      if(this.value.trim() === '') {
        // this.error = 'Please enter a description to extract expenses.';
        this.snackBar.open('Please enter a description to extract expenses.', 'Close', {
          duration: 3000
        });
      } else {
        // this.error = 'Failed to extract expenses. Please try again later.';
        this.snackBar.open('Failed to extract expenses. Please try again.', 'Close', {
          duration: 3000
        });
      }

      console.error('Error:', error);
      this.isLoading = false; 
    });
    
  }

  removeExpense(expense: ExpenseModel) {
        var index = this.aiGeneratedExpenses.findIndex(e => e.id === expense.id);
     if (index !== -1) {
      this.aiGeneratedExpenses.splice(index, 1);
     }
  }

  saveAll() {
    console.log('Saving expenses:', this.expenses);
    this.error = "";
    this.expensesService.saveAll(this.aiGeneratedExpenses, this.sharedDataService.currentEmail)
      .subscribe(res => {
          console.log('All saved', res);
          this.snackBar.open('Expenses saved successfully!', 'Close', {
            duration: 3000
          });
          this.value = "";
           this.changeExpenses.emit(res);
      this.aiGeneratedExpenses = [];
      this.newExpense = {
        id: 0,
        categoryId: 0,
        amount: 0.0,
        currency: "LEI",
        userEmail: this.sharedDataService.currentEmail ,
        isEditing: true,
        paymentDate: new Date()
      };
          this.router.navigate(['/expenses']);
        }, (error) => {
          this.snackBar.open('Failed to save expenses. Please try again.', 'Close', {
            duration: 3000
          });
          console.error('Error saving expenses:', error);
        }
      );
  }

  saveExpense(expense: ExpenseModel) {
     console.log("Saving expense:", expense);
    if (expense.amount <= 0) {
      this.snackBar.open("Please enter a valid amount greater than 0.", "Close", {
        duration: 3000
      });
      return;
    }
   
   if(expense.paymentDate === undefined || expense.paymentDate === null) {
       this.snackBar.open("Please enter a valid payment date.", "Close", {
        duration: 3000
      });
      return;
    }
     console.log('Saving expense:', expense);
// expense.userEmail = this.sharedDataService.currentEmail;
    this.expensesService.saveExpense(expense)
    .subscribe(res => {
        this.snackBar.open("Expense saved! Check the whole list of expenses!", "Close", {
        duration: 3000
      });
      this.changeExpenses.emit(res);
      this.aiGeneratedExpenses = [];
      this.newExpense = {
        id: 0,
        categoryId: 0,
        amount: 0.0,
        currency: "LEI",
        userEmail: this.sharedDataService.currentEmail ,
        isEditing: true,
        paymentDate: new Date()
      };
      this.router.navigate(['/expenses']);
    }, (error) => {
      this.snackBar.open("Something went wrong with the save. Please try again or come back later!", "Close", {
        duration: 3000
      });
    });
  }

selectedMode: 'manual' | 'ai' = 'ai';
}

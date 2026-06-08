
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryModel } from 'src/app/models/CategoryModel';
import { ExpenseModel } from 'src/app/models/ExpenseModel';
import { AiServiceService } from 'src/app/services/ai-service.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { ExpensesService } from 'src/app/services/expenses.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BudgetModel } from 'src/app/models/BudgetModel';
import { BudgetsService } from 'src/app/services/budgets.service';

@Component({
  selector: 'app-new-budget',
  templateUrl: './new-budget.component.html',
  styleUrls: ['./new-budget.component.scss']
})
export class NewBudgetComponent implements OnInit  {
   constructor(
      private budgetsService: BudgetsService,
      private sharedDataService: SharedDataService,
      private snackBar: MatSnackBar
    ) { }
     value: string = '';
      categories: CategoryModel[] = [];
      isLoading: boolean= false;
      error: string = "";
      newBudget: BudgetModel = {
        id: 0,
        monthlyLimit: 0.0,
       
        userEmail: this.sharedDataService.currentEmail , 
        isEditing: true, 
        budgetMonth: new Date()
      };
      

      @Input() budgets: BudgetModel[] = [];
      
      @Output() changeBudgets = new EventEmitter<BudgetModel[]>();  
  ngOnInit() {


  }

  saveBudget(budget: BudgetModel) {
   

    console.log("Saving budget:", budget);
    if (budget.monthlyLimit <= 0) {
      this.snackBar.open("Please enter a valid monthly limit greater than 0.", "Close", {
        duration: 3000
      });
      return;
    }
    if(!budget.budgetMonth){
      this.snackBar.open("Please enter a valid date for the budget month and year.", "Close", {
        duration: 3000
      });
      return;
    }
    this.budgetsService.saveBudget(budget)
    .subscribe(res => {
        this.snackBar.open("Budget saved! Check the whole list of budgets on Budgets page!", "Close", {
        duration: 3000
      });
      this.changeBudgets.emit(res);
      this.newBudget = {
        id: 0,
        monthlyLimit: 0.0,
       
        userEmail: this.sharedDataService.currentEmail , 
        isEditing: true, 
        budgetMonth: new Date()
      };
    }, (error) => {
      this.snackBar.open("Something went wrong with the save. Please try again or come back later!", "Close", {
        duration: 3000
      });
    });
  }

}

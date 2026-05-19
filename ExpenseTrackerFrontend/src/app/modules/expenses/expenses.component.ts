import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AiExpenseModel } from 'src/app/models/AiExpenseModel';
import { AiServiceService } from 'src/app/services/ai-service.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent {
  constructor(private aiService: AiServiceService) { }
  
  value: string = '';
  expenses: AiExpenseModel[] = [];

  extract() {
    this.aiService.extract(this.value).subscribe(res => {
      console.log(res);
      this.expenses = res;
    }, error => {
      console.error('Error:', error); 
    });
  }

  removeExpense(index: number) {
    this.expenses.splice(index, 1);
  }

saveAll() {
  this.aiService.saveAllExpenses(this.expenses).subscribe(res => {
      console.log('All saved');
    });
}
}

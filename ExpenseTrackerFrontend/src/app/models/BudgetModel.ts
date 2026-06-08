import { ExpenseModel } from "./ExpenseModel";

export interface BudgetModel {
    id?: number;
 
  monthlyLimit: number;
 
  budgetMonth: Date;

  userEmail: string;
    isEditing?: boolean;
  isloading?: boolean;
isSaving?: boolean;
  originalBudget?: BudgetModel;
}
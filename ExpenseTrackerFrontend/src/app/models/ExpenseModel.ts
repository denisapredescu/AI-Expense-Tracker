import { CategoryModel } from "./CategoryModel";

export interface ExpenseModel {
  id?: number;
  categoryId: number;
  category?: CategoryModel;
  amount: number;
  currency?: string;
  paymentMethod?: string;
  paymentDate?: Date;
  merchant?: string;
  description?: string;
  userEmail: string;

  isEditing?: boolean;
  isloading?: boolean;
  isSaving?: boolean;
  originalExpense?: ExpenseModel;
}
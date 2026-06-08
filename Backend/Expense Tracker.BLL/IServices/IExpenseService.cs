using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.BLL.IServices
{
    public interface IExpenseService
    {
        Task<List<Expense>> UpdateExpense(Expense expenseModel);
        Task<List<Expense>> DeleteExpense(int budgetId);
        Task<Expense> GetExpenseById(int id);
        Task<List<Expense>> GetExpensesByUser(string userEmail);
        Task<List<Expense>> CreateExpense(Expense expenseModel);
        Task<List<Expense>> SaveAllExpenses(List<Expense> expenses, string userEmail);
    }

}

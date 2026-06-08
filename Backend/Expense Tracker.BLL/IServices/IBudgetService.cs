using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.BLL.IServices
{
    public interface IBudgetService
    {
        Task<List<BudgetModel>> CreateBudget(Budget budget);
        Task<List<BudgetModel>> GetBudgets(string userEmail);
        Task<List<BudgetModel>> UpdateBudget(Budget budget);
        Task<List<BudgetModel>> DeleteBudget(int budgetId);
        Task<Budget> GetBudgetById(int id);

    }
}

using Expense_Tracker.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.IRepositories
{
    public interface IBudgetRepository
    {
        Task AddBudget(Budget budget);
        IQueryable<Budget> GetBudgetById(int id);
        IQueryable<IEnumerable<Budget>> GetBudgetsByUserEmail(string userEmail);
        Task UpdateBudget(Budget budget);
        Task DeleteBudget(Budget budget);
    }
}

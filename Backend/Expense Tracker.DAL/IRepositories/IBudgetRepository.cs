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
        Task Create(Budget budget);
        IQueryable<Budget> GetAll();

        //IQueryable<Budget> GetBudgetById(int id);
        //IQueryable<IEnumerable<Budget>> GetBudgetsByUserEmail(string userEmail);
        Task Update(Budget budget);
        Task Delete(Budget budget);
    }
}

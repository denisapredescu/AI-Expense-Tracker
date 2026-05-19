using Expense_Tracker.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.IRepositories
{
    public interface IExpenseRepository
    {   Task AddExpense(Expense expense);
        IQueryable<Expense> GetExpenseById(int id);
        //IQueryable<IEnumerable<Expense>> GetExpensesByUserEmail(string userEmail);

        IQueryable<Expense> GetExpensesByUserEmail(string userEmail);
        Task UpdateExpense(Expense expense);
        Task DeleteExpense(Expense expense);
    }
}

using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.Repositories
{
    public class ExpenseRepository: IExpenseRepository
    {
        public AppDbContext _context;
    
            public ExpenseRepository(AppDbContext context)
            {
                _context = context;
            }
    
            public async Task AddExpense(Expense expense)
            {
                _context.Expenses.Add(expense);
                await _context.SaveChangesAsync();
            }
    
            public Task UpdateExpense(Expense expense)
            {
                _context.Expenses.Update(expense);
                return _context.SaveChangesAsync();
            }
    
            public async Task DeleteExpense(Expense expense)
            {
                _context.Remove(expense);
                await _context.SaveChangesAsync();
            }
    
            public IQueryable<Expense> GetExpenseById(int id)
            {
                return _context.Expenses.Where(e => e.Id == id);
            }
    
            public IQueryable<Expense> GetExpensesByUserEmail(string userEmail)
            {
            return _context.Expenses.Where(e => e.UserEmail == userEmail); //.GroupBy(e => new { e.PaymentDate.Substring(0, 7) }).Select(g => g.AsEnumerable());
        }
    }
}

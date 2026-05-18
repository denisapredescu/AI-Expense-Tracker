using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.Repositories
{
    public class BudgetRepository: IBudgetRepository
    {
        public AppDbContext _context;

        public BudgetRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddBudget(Budget budget)
        {
            _context.Budgets.Add(budget);
            await _context.SaveChangesAsync();
        }

        public Task UpdateBudget(Budget budget)
        {
            _context.Budgets.Update(budget);
            return _context.SaveChangesAsync();
        }

        public async Task DeleteBudget(Budget budget)
        {
            _context.Remove(budget);
            await _context.SaveChangesAsync();
        }

        public IQueryable<Budget> GetBudgetById(int id)
        {
            return _context.Budgets.Where(b => b.Id == id);
        }

        public IQueryable<IEnumerable<Budget>> GetBudgetsByUserEmail(string userEmail)
        {
            return _context.Budgets.Where(b => b.UserEmail == userEmail).GroupBy(b => new { b.Month, b.Year }).Select(g => g.AsEnumerable());
        }

        
    }
}

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

        //public async Task Create(Budget budget)
        //{
        //    _context.Budgets.Add(budget);
        //    await _context.SaveChangesAsync();
        //}

        public async Task Update(Budget budget)
        {
            _context.Budgets.Update(budget);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Budget budget)
        {
            _context.Remove(budget);
            await _context.SaveChangesAsync();
        }

        //public IQueryable<Budget> GetBudgetById(int id)
        //{
        //    return _context.Budgets.Where(b => b.Id == id);
        //}

        //public IQueryable<IEnumerable<Budget>> GetBudgetsByUserEmail(string userEmail)
        //{
        //    return _context.Budgets.Where(b => b.UserEmail == userEmail).GroupBy(b => new { b.Month, b.Year }).Select(g => g.AsEnumerable());
        //}

        public async Task Create(Budget budget)
        {
            await _context.Budgets.AddAsync(budget);  //adaug 
            await _context.SaveChangesAsync();   //salvez modificarea in dbset
        }

        public IQueryable<Budget> GetAll()
        {
            return _context.Budgets;
        }
    }
}

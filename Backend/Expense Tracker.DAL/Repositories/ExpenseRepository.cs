using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.IRepositories;
using Microsoft.EntityFrameworkCore;
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
    
            public async Task Create(Expense expense)
            {
                await _context.Expenses.AddAsync(expense);
                await _context.SaveChangesAsync();
            }

        public async Task Update(Expense expense)
        {
            try {
                _context.Expenses.Update(expense);
                await _context.SaveChangesAsync();
            } catch(Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw new ArgumentException(ex.ToString());
            }
            }
    
            public async Task Delete(Expense expense)
            {
                _context.Remove(expense);
                await _context.SaveChangesAsync();
            }

            public IQueryable<Expense> GetAll()
            {
            return _context.Expenses.Include(x => x.Category);
            }
    }
}


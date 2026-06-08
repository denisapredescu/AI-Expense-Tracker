using Expense_Tracker.BLL.IServices;
using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.IRepositories;
using Expense_Tracker.DAL.Models;
using Expense_Tracker.DAL.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.BLL.Services
{
    public class BudgetService : IBudgetService
    {
        private readonly IBudgetRepository _budgetRepository;

        public BudgetService(IBudgetRepository budgetRepository)
        {
            _budgetRepository = budgetRepository;
        }

        public async Task<List<BudgetModel>> CreateBudget(Budget budget)
        {
            var ok = _budgetRepository
              .GetAll()
              .Where(x => x.BudgetMonth.Month == budget.BudgetMonth.Month && x.BudgetMonth.Year == budget.BudgetMonth.Year && x.UserEmail == budget.UserEmail).FirstOrDefault();  //introduc categoria doar daca nu este deja inserata

            if (ok == null)
                await _budgetRepository.Create(budget);

            return await GetBudgets(budget.UserEmail);
        }

        public async Task<Budget> GetBudgetById(int id)
        {
            if (id == 0)
            {
                throw new ArgumentException("Budget id cannot be 0");
            }
            if (id == null)
            {
                throw new ArgumentNullException("Budget id cannot be null");
            }
            return await _budgetRepository
                .GetAll()
                .Where(x => x.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<BudgetModel>> DeleteBudget(int budgetId)
        {
            var budgetToDelete = await GetBudgetById(budgetId);

            if(budgetToDelete != null)
                await _budgetRepository.Delete(budgetToDelete);

            return await GetBudgets(budgetToDelete.UserEmail);
        }

        public async Task<List<BudgetModel>> GetBudgets(string userEmail)
        {
            return await _budgetRepository
          .GetAll()
          .Where(x => x.UserEmail == userEmail)
          .Select(x => new BudgetModel
          {
              Id = x.Id,
              MonthlyLimit = x.MonthlyLimit,
              BudgetMonth = x.BudgetMonth,
              //CategoryId = x.CategoryId,
              //Category = x.Category.Name,
              UserEmail = x.UserEmail
          }).ToListAsync();
        }

        public async Task<List<BudgetModel>> UpdateBudget(Budget budget)
        {
            var ok = await _budgetRepository
             .GetAll()

    .AsNoTracking()
             .Where(x => x.Id == budget.Id).FirstOrDefaultAsync();  //introduc categoria doar daca nu este deja inserata

            if (ok == null)
                await _budgetRepository.Create(budget);
            else 
                await _budgetRepository.Update(budget);

            return await GetBudgets(budget.UserEmail);
        }


        //public async Task<List<Category>> GetCategories()
        //{

        //    return await _categoryRepository
        //        .GetAll()
        //        .ToListAsync();
        //}
    }
}

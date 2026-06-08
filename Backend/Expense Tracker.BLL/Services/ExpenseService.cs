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
    public class ExpenseService : IExpenseService
    {
        private readonly IExpenseRepository _expenseRepository;
        private readonly ICategoryService _categoryService;

        public ExpenseService(IExpenseRepository expenseRepository, ICategoryService categoryService)
        {
            _expenseRepository = expenseRepository;
            _categoryService = categoryService;
        }

        public async Task<List<Expense>> CreateExpense(Expense expenseModel)
        {
            var ok = _expenseRepository
             .GetAll()
             .Where(x => x.CategoryId == expenseModel.CategoryId
             && x.PaymentDate == expenseModel.PaymentDate
             && x.Amount == expenseModel.Amount).FirstOrDefault();  //introduc categoria doar daca nu este deja inserata

            if (ok == null)
                await _expenseRepository.Create(expenseModel);

            return await GetExpensesByUser(expenseModel.UserEmail);
          

    

        }


        public async Task<List<Expense>> UpdateExpense(Expense expenseModel)
        {
            var ok = await _expenseRepository
             .GetAll()
    .AsNoTracking()
             .Where(x => x.Id == expenseModel.Id).FirstOrDefaultAsync();  //introduc categoria doar daca nu este deja inserata

            if (ok == null)
                await _expenseRepository.Create(expenseModel);
            else
                await _expenseRepository.Update(expenseModel);


                var exp = await GetExpensesByUser(expenseModel.UserEmail);
            return exp;



        }


        public async Task<List<Expense>> DeleteExpense(int expenseId)
        {
            var expenseToDelete = await GetExpenseById(expenseId);
            await _expenseRepository.Delete(expenseToDelete);

            return await GetExpensesByUser(expenseToDelete.UserEmail);
        }

        public async Task<List<Expense>> GetExpensesByUser(string userEmail)
        {
            return await _expenseRepository
                .GetAll()
                .Where(x => x.UserEmail == userEmail)
                .ToListAsync();
        }

        public async Task<Expense> GetExpenseById(int id)
        {
            if(id == 0)
            {
                throw new ArgumentException("Expense id cannot be 0");
            }
            if(id == null)
            {
                throw new ArgumentNullException("Expense id cannot be null");
            }
            return await _expenseRepository
                .GetAll()
                .Where(x => x.Id == id).FirstOrDefaultAsync();
        }



        public async Task<List<Expense>> SaveAllExpenses(List<Expense> expenses, string userEmail)
        {
           foreach(Expense expense in expenses){
                await CreateExpense(expense);
            }

            return await GetExpensesByUser(userEmail);
        }

       

        //public Task<string> UpdateExpense(UpdateExpenseModel updateExpenseModel)
        //{
        //    throw new NotImplementedException();
        //}
    }
}

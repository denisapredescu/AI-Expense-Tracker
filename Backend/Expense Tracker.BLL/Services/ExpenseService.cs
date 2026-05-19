using Expense_Tracker.BLL.IServices;
using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.BLL.Services
{
    public class ExpenseService : IExpenseService
    {
      

        //public Task<string> AddExpense(AddExpenseModel addExpenseModel)
        //{
        //    throw new NotImplementedException();
        //}

        public Task<string> DeleteExpense(int expenseId)
        {
            throw new NotImplementedException();
        }

        public Task<List<Expense>> GetExpenseByUser(string userEmail)
        {
            throw new NotImplementedException();
        }

        //public Task<string> UpdateExpense(UpdateExpenseModel updateExpenseModel)
        //{
        //    throw new NotImplementedException();
        //}
    }
}

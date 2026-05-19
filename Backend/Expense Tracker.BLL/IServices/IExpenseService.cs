using Expense_Tracker.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.BLL.IServices
{
    public interface IExpenseService
    {
        //Task<String> AddExpense(AddExpenseModel addExpenseModel);
        //Task<String> UpdateExpense(UpdateExpenseModel updateExpenseModel);
        Task<String> DeleteExpense(int expenseId);
        Task<List<Expense>> GetExpenseByUser(String userEmail);
    }
}

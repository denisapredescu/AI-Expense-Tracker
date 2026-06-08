using Expense_Tracker.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.IRepositories
{
    public interface IExpenseRepository
    {   Task Create(Expense expense);
        IQueryable<Expense> GetAll();

        Task Update(Expense expense);
        Task Delete(Expense expense);
    }
}

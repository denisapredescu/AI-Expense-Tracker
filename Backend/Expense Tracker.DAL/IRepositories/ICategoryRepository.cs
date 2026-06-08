using Expense_Tracker.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.IRepositories
{
    public interface ICategoryRepository
    {
        IQueryable<Category> GetAll();
        Task Create(Category category);

    }
}

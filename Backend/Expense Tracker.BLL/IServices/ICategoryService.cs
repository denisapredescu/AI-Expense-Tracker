using Expense_Tracker.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.BLL.IServices
{
    public interface ICategoryService
    {
        Task<Category> GetCategoryByName(string name);
        Task<List<Category>> GetCategories();
        Task<Category> CreateCategory(Category category);
        Task<List<string>> GetCategoriesNames();



    }
}

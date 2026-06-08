using Expense_Tracker.BLL.IServices;
using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.IRepositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.BLL.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<Category?> GetCategoryByName(string categoryName)
        {
            if(categoryName == null)
                return null;

            return await _categoryRepository.GetAll().Where(x => x.Name == categoryName).FirstOrDefaultAsync();
        }

        public async Task<List<string>> GetCategoriesNames()
        {

            return await _categoryRepository
                .GetAll()
                .Select(x => x.Name)
                .ToListAsync();
        }

        public async Task<List<Category>> GetCategories()
        {

            return await _categoryRepository
                .GetAll()
                .ToListAsync();
        }

        public async Task<Category> CreateCategory(Category category)
        {
            var ok = _categoryRepository
              .GetAll()
              .Where(x => x.Name == category.Name).FirstOrDefault();  //introduc categoria doar daca nu este deja inserata

            if (ok == null)
                await _categoryRepository.Create(category);

            return await GetCategoryByName(category.Name);
        }


    }
}

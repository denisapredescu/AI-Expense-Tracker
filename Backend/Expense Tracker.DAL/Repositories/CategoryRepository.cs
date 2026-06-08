using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.IRepositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.Repositories
{
    public class CategoryRepository: ICategoryRepository
    {
        //avem nevoie de context pentru a lucra cu baza de doate
        private readonly AppDbContext _context; //nu vrem sa se modifice aici, ci doar in interiorul bdului
        // _ pune cand e private

        //acum facem injection: dam contextul ca parametru
        public CategoryRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task Create(Category category)
        {
            await _context.Categories.AddAsync(category);  //adaug categoria
            await _context.SaveChangesAsync();   //salvez modificarea in dbset
        }

        public IQueryable<Category> GetAll()
        {
            return _context.Categories;
        }
    }
}

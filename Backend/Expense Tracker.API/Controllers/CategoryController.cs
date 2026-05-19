using Expense_Tracker.BLL.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Expense_Tracker.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CategoryController: ControllerBase
    {
        private readonly ICategoryService _categoryService;

        CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }
    }
}

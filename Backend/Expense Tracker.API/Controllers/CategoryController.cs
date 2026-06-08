using Expense_Tracker.BLL.IServices;
using Expense_Tracker.DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Expense_Tracker.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CategoryController: ControllerBase
    {
        private readonly ICategoryService _categoryService;

       public  CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateExpense([FromBody] Category category)
        {
            //var result = await _geminiService.ExtractExpenses(request.Text);



            if (category == null)
                return BadRequest("Expense was not provided!");

            var result = await _categoryService.CreateCategory(category);
      
            return Ok(result);
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _categoryService.GetCategories();
            return Ok(result);
        }
    }
}

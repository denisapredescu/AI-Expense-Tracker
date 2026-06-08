using Expense_Tracker.BLL.IServices;
using Expense_Tracker.BLL.Services;
using Expense_Tracker.DAL.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Expense_Tracker.API.Controllers
{

    [Route("[controller]")]
    [ApiController]
    public class BudgetController: ControllerBase
    {
        private readonly IBudgetService _budgetService;

        public BudgetController(IBudgetService budgetService)
        {
            _budgetService = budgetService;
        }

        [HttpPost("Save")]
        public async Task<IActionResult> CreateBudget([FromBody] Budget budget)
        {

            if (budget == null)
                return BadRequest("Budget was not provided!");

            var result = await _budgetService.CreateBudget(budget);

            return Ok(result);
        }

        [HttpPost("Update")]
        public async Task<IActionResult> UpdateBudget([FromBody] Budget budget)
        {

            if (budget == null)
                return BadRequest("Budget was not provided!");

            var result = await _budgetService.UpdateBudget(budget);

            return Ok(result);
        }

      
        [HttpDelete("Delete")]
        public async Task<IActionResult> DeleteBudget([FromQuery] int budgetId)
        {
            var result = await _budgetService.DeleteBudget(budgetId);
            return Ok(result);
        }
    


        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll([FromQuery] string userEmail)
        {
            var result = await _budgetService.GetBudgets(userEmail);
            return Ok(result);
        }
    }
}

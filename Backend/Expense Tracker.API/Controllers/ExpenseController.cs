using Expense_Tracker.BLL.IServices;
using Expense_Tracker.BLL.Services;
using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using static System.Net.Mime.MediaTypeNames;

namespace Expense_Tracker.API.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("/[controller]")]
    [ApiController]
    public class ExpenseController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        public ExpenseController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        [HttpPost("SaveAll")]
        public async Task<IActionResult> SaveAllExpenses([FromBody] List<Expense> expenses, [FromQuery] string userEmail)
        {
            //var result = await _geminiService.ExtractExpenses(request.Text);
            if (userEmail == null || userEmail == "")
                return BadRequest("No email provided!");


            if (expenses.Count == 0)
                return BadRequest("No expenses to save!");

            var result = await _expenseService.SaveAllExpenses(expenses, userEmail);

            return Ok(result);
        }

        [HttpPost("Save")]
        public async Task<IActionResult> CreateExpense([FromBody] Expense expense)
        {
            //var result = await _geminiService.ExtractExpenses(request.Text);



            if (expense == null)
                return BadRequest("Expense was not provided!");

            var result = await _expenseService.CreateExpense(expense);

            return Ok(result);
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetExpensesByUser([FromQuery] string userEmail)
        {
            if (userEmail == null || userEmail == "")
                return BadRequest("No email provided!");

            var expenses = await _expenseService.GetExpensesByUser(userEmail);
            
            if (expenses == null)
            {
                return NotFound("No expenses found for the user.");
            }
            
            return Ok(expenses);
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> DeleteExpense([FromBody] Expense expense)
        {
            var result = await _expenseService.DeleteExpense(expense.Id);
            return Ok(result);
        }

        [HttpPost("Update")]
        public async Task<IActionResult> UpdateExpense([FromBody] Expense budget)
        {

            if (budget == null)
                return BadRequest("Budget was not provided!");

            var result = await _expenseService.UpdateExpense(budget);

            return Ok(result);
        }
    }
}

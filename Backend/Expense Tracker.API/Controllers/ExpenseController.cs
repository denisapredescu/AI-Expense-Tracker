using Expense_Tracker.BLL.IServices;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;

namespace Expense_Tracker.API.Controllers
{
    [Microsoft.AspNetCore.Mvc.Route("/[controller]")]
    [ApiController]
    public class ExpenseController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        ExpenseController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        //[HttpPost("AddExpense")]
        //public async Task<IActionResult> AddExpense(AddExpenseModel addExpenseModel)
        //{
        //    String result = await _expenseService.AddExpense(addExpenseModel);
        //    if (result != "true")
        //    {
        //        return BadRequest("Adding expense failed: " + result);
        //    }
        //    return Ok();
        //}

        //[HttpPut("UpdateExpense")]
        //public async Task<IActionResult> UpdateExpense(UpdateExpenseModel updateExpenseModel)
        //{
        //    String result = await _expenseService.UpdateExpense(updateExpenseModel);
        //    if (result != "true")
        //    {
        //        return BadRequest("Updating expense failed: " + result);
        //    }
        //    return Ok();
        //}

        [HttpDelete("DeleteExpense")]
        public async Task<IActionResult> DeleteExpense(int expenseId)
        {
            String result = await _expenseService.DeleteExpense(expenseId);
            if (result != "true")
            {
                return BadRequest("Deleting expense failed: " + result);
            }
            return Ok();
        }

        [HttpGet("GetExpenseByUser")]
        public async Task<IActionResult> GetExpenseByUser(String userEmail)
        {
            var expenses = await _expenseService.GetExpenseByUser(userEmail);
            if (expenses == null)
            {
                return NotFound("No expenses found for the user.");
            }
            return Ok(expenses);
        }
    }
}

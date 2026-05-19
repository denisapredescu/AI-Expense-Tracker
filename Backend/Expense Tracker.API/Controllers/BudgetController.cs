using Expense_Tracker.BLL.IServices;
using Microsoft.AspNetCore.Mvc;

namespace Expense_Tracker.API.Controllers
{

    [Route("[controller]")]
    [ApiController]
    public class BudgetController: ControllerBase
    {
        private readonly IBudgetService _budgetService;

        BudgetController(IBudgetService budgetService)
        {
            _budgetService = budgetService;
        }
    }
}

using Expense_Tracker.BLL.Services;
using Expense_Tracker.DAL.Models;
using Microsoft.AspNetCore.Mvc;

namespace Expense_Tracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly GeminiService _geminiService;

        public AiController(GeminiService geminiService)
        {
            _geminiService = geminiService;
        }

        [HttpPost("extract")]
        public async Task<IActionResult> Extract([FromBody] ExtractRequest request)
        {
            var result = await _geminiService.ExtractExpenses(request.Text);


            return Ok(result);
        }
    }
}

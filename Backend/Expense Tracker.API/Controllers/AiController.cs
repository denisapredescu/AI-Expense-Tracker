using Expense_Tracker.BLL.Services;
using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Host.Mef;
using System.Reflection.Metadata;

namespace Expense_Tracker.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AiController : ControllerBase
    {
        private readonly AIService _geminiService;

        public AiController(AIService geminiService)
        {
            _geminiService = geminiService;
        }

        [HttpPost("extract")]
        public async Task<IActionResult> Extract([FromBody] ExtractRequest request)
        {
            var text = request.Text;

            if (string.IsNullOrEmpty(text))
                return BadRequest("Text is empty");

            var result = await _geminiService.ExtractExpenses(text);

            return Ok(result);
        }

        [HttpGet("getInsights")]
        public async Task<IActionResult> GetInsights([FromQuery] string userEmail, [FromQuery] DateTime selectedMonth)
        {
            if (selectedMonth.Equals("") || selectedMonth == null)
                return BadRequest("Selected Month is empty");

            var result = await _geminiService.GetInsigths(userEmail, selectedMonth);

            return Ok(result);
        }
    }
}

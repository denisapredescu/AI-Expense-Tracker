using Expense_Tracker.DAL.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Expense_Tracker.BLL.Services
{
    public class GeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;

        public GeminiService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<List<ExpenseAiDto>> ExtractExpenses(string userText)
        {
            string generatedExpenses = await ExtractExpensesUsingGemini(userText);

            List<ExpenseAiDto> expenses = await ConvertStringIntoExpensesFormat(generatedExpenses);
            return expenses;
        }


        public Task<List<ExpenseAiDto>> ConvertStringIntoExpensesFormat(string generatedExpenses)
        {

            using var doc = JsonDocument.Parse(generatedExpenses);

            var actualExpenses = doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            if (string.IsNullOrWhiteSpace(actualExpenses))
                throw new Exception("AI returned empty expense content");

            var expenses = JsonSerializer.Deserialize<List<ExpenseAiDto>>(actualExpenses);

            if (expenses == null || expenses.Count == 0)
                throw new Exception("Something went wrong with the deserialization");

            return Task.FromResult(expenses);
        }



        public async Task<string> ExtractExpensesUsingGemini(string userText)
        {
            var apiKey = _config["Gemini:ApiKey"];

            var prompt = $@"
                Extract expenses from this text.

                Use ONLY these categories:
                - Food
                - Transportation
                - Bills
                - Shopping
                - Entertainment
                - Health
                - Other

                Return ONLY raw JSON.
                Do not use markdown.
                Do not use ```json.

                Return ONLY valid JSON array matching this schema:

                ExpenseAiDto:
                - Category: string
                - Amount: number
                - Currency: string
                - PaymentMethod: string
                - Merchant: string
                - Description: string

                Text:
                {userText}
                ";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new
                            {
                                text = prompt
                            }
                        }
                    }
                }
            };

            var response = await _httpClient.PostAsJsonAsync(
                //$"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={apiKey}",

                $"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={apiKey}",
                requestBody);

            //response.EnsureSuccessStatusCode();
            var responseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine(responseBody);
            return await response.Content.ReadAsStringAsync();
        }
    }
}

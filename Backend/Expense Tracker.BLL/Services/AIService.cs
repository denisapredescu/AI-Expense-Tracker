using Expense_Tracker.BLL.IServices;
using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Reflection;
using System.Reflection.Metadata;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Expense_Tracker.BLL.Services
{
    public class AIService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly ICategoryService _categoryService;
        private readonly IBudgetService _budgetService;
        private readonly IExpenseService _expenseService;

        public AIService(HttpClient httpClient, IConfiguration config, ICategoryService categoryService, IBudgetService budgetService, IExpenseService expenseService)
        {
            _httpClient = httpClient;
            _config = config;
            _categoryService = categoryService;
            _budgetService = budgetService;
            _expenseService = expenseService;
        }

        public async Task<List<AddExpenseModel>> ExtractExpenses(string text)
        {
            string categories = string.Join("; ", _categoryService.GetCategories().Result.Select(x => "Id: " + x.Id + " for category name: " + x.Name));
     
            var prompt = $@"
                You are an EXPENSE EXTRACTION ENGINE.

                You do NOT talk.
                You do NOT explain.
                You do NOT format text.
                You ONLY return JSON.

                ==================================================
                INPUT RULES
                ==================================================
                Extract expenses from the input text.

                Use ONLY these categories (categoryId is mandatory):
                {categories}

                ==================================================
                OUTPUT RULES (HARD CONSTRAINTS)
                ==================================================
                - Output MUST be valid JSON
                - Output MUST be a JSON array
                - NO markdown
                - NO backticks
                - NO comments
                - NO trailing commas
                - NO explanations
                - NO extra text before or after JSON
                - If output is invalid JSON → it is rejected

                ==================================================
                STRICT OUTPUT FORMAT
                ==================================================
                [
                  {{
                    ""categoryId"": number,
                    ""amount"": number,
                    ""currency"": ""LEI"",
                    ""paymentMethod"": ""Cash"" | ""Card"",
                    ""paymentDate"": ""{DateTime.UtcNow:yyyy-MM-dd}"",
                    ""merchant"": ""string"",
                    ""description"": ""string""
                  }}
                ]

                ==================================================
                FIELD RULES
                ==================================================
                - categoryId: MUST match one of the provided categories
                - amount: numeric only (no text, no currency symbols)
                - currency: always ""LEI"" unless explicitly stated otherwise
                - paymentMethod:
                    - if card, credit card, visa, mastercard → ""Card""
                    - otherwise → ""Cash""
                - paymentDate: use today if not explicitly mentioned
                - merchant:
                    - extract store/service name if present (Lidl, Kaufland, OMV, etc.)
                    - otherwise empty string
                - description:
                    - short phrase like ""groceries"", ""fuel"", ""coffee""

                ==================================================
                INPUT TEXT
                ==================================================
                {text}
                ";

            var responseString = await OpenRouterExecutor(prompt);

            return await ConvertOpenRouterStringIntoExpensesFormat(responseString);
        }

        public async Task<InsightsModel> GetInsigths(string userEmail, DateTime selectedMonth)
        {
            var budgets = await _budgetService.GetBudgets(userEmail);
            var expenses = await _expenseService.GetExpensesByUser(userEmail);

            var currentBudget = budgets.Where(budget => budget.BudgetMonth.Year == selectedMonth.Year && budget.BudgetMonth.Month == selectedMonth.Month).ToList();
            var currentExpenses = expenses.Where(exp => exp.PaymentDate.Month == selectedMonth.Month && exp.PaymentDate.Year == selectedMonth.Year).ToList();


            var currentBudgetJson = JsonSerializer.Serialize(currentBudget);
            var currentExpensesJson = JsonSerializer.Serialize(currentExpenses);

            var budgetsJson = JsonSerializer.Serialize(budgets);
            var expensesJson = JsonSerializer.Serialize(expenses);

            var prompt = $@"
                You are an EXPENSE EXTRACTION ENGINE.

                You do NOT talk.
                You do NOT explain.
                You ONLY return a text response.

                ==================================================
                INPUT RULES
                ==================================================
                Extract expense and budget AI Insights from the given month based on past and current data.

                Use ONLY these budget {currentBudgetJson} and expenses {currentExpensesJson} as current data. You can discuss about the budget, expenses, savings, most used category, percentages.
                
                Compare and give insight having in mind also this past budgets {budgetsJson} and expenses {expensesJson}.

                ==================================================
                STRICT OUTPUT FORMAT
                ==================================================
                [
                  {{
                    ""monthlyInsights"": text,
                    ""comparedWithOtherMonths"": text
                  }}
                ]

                ==================================================
                FIELD RULES
                ==================================================
                - monthlyInsights: MUST include insights based on the current month budget and expenses.
                - comparedWithOtherMonths:  MUST include insights by comparing current data with past month budgets and expenses.

                ";


            var responseString = await OpenRouterExecutor(prompt);

            return await ConvertOpenRouterStringIntoInsightsFormat(responseString);
        }

        public async Task<string> OpenRouterExecutor(string prompt)
        {
            var apiKey = _config["OpenRouter:ApiKey"];

            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", apiKey);

            var request = new OpenRouterRequest
            {
                model = "openai/gpt-3.5-turbo",

                messages = new List<OpenRouterMessage>
            {
                new OpenRouterMessage
                {
                    role = "system",
                    content = prompt
                }
            }
            };

            var json = JsonSerializer.Serialize(request);

            var content = new StringContent(
                json,
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync(
                "https://openrouter.ai/api/v1/chat/completions",
                content);

            var responseString =
                await response.Content.ReadAsStringAsync();

            return responseString;

        }

        //public async Task<List<AddExpenseModel>> ExtractExpenses(string userText)
        //{
        //    string generatedExpenses = await ExtractExpensesUsingGemini(userText);

        //    List<AddExpenseModel> expenses = await ConvertStringIntoExpensesFormat(generatedExpenses);
        //    return expenses;
        //}

        public Task<InsightsModel> ConvertOpenRouterStringIntoInsightsFormat(string generatedExpenses)
        {
            // extract only JSON
            var ExpensesJson = ExtractJsonArray(generatedExpenses);

            // 1. If it's string-encoded JSON → decode it
            if (ExpensesJson.TrimStart().StartsWith("\""))
            {
                ExpensesJson = JsonSerializer.Deserialize<string>(ExpensesJson);
            }

            // 2. Deserialize partial objects
            var partial = JsonSerializer.Deserialize<InsightsModel[]>(ExpensesJson);

            // 3. Enrich missing fields
            var expenses = partial?.Select(x => new InsightsModel
            {
                monthlyInsights = x.monthlyInsights,
                comparedWithOtherMonths = x.comparedWithOtherMonths
            }).ToList();


            if (expenses == null || expenses.Count == 0)
                throw new Exception("Something went wrong with the deserialization");

            return Task.FromResult(expenses.First());
        }
        public Task<List<AddExpenseModel>> ConvertOpenRouterStringIntoExpensesFormat(string generatedExpenses)
        {
            // extract only JSON
            var ExpensesJson = ExtractJsonArray(generatedExpenses);

            // 1. If it's string-encoded JSON → decode it
            if (ExpensesJson.TrimStart().StartsWith("\""))
            {
                ExpensesJson = JsonSerializer.Deserialize<string>(ExpensesJson);
            }

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                NumberHandling = System.Text.Json.Serialization.JsonNumberHandling.AllowReadingFromString
            };

            // 2. Deserialize partial objects
            var partial = JsonSerializer.Deserialize<List<AddExpenseModel>>(ExpensesJson, options);


            if (partial == null || !partial.Any())
                throw new Exception("Deserialization failed or empty JSON");

            // 3. Enrich missing fields
            var expenses = partial.Select(x => new AddExpenseModel
            {
                CategoryId = x.CategoryId,
                Amount = x.Amount,
                Currency = x.Currency ?? "LEI",
                PaymentMethod = x.PaymentMethod ?? "",
                PaymentDate = x.PaymentDate == default ? DateTime.UtcNow : x.PaymentDate,
                Merchant = x.Merchant ?? "",
                Description = x.Description ?? "",
                UserEmail = x.UserEmail ?? "none email"
            }).ToList();


            if (expenses == null || expenses.Count == 0)
                throw new Exception("Something went wrong with the deserialization");

            return Task.FromResult(expenses);
        }

        private string ExtractJsonArray(string generatedExpenses)
        {
            using var doc = JsonDocument.Parse(generatedExpenses);

            var stringJson = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            if (string.IsNullOrWhiteSpace(stringJson))
                throw new Exception("AI returned empty expense content");

            if (string.IsNullOrWhiteSpace(stringJson))
                throw new Exception("Empty model output");

            // remove markdown
            stringJson = stringJson
                .Replace("```json", "")
                .Replace("```", "")
                .Trim();


            var start = stringJson.IndexOf('[');
            var end = stringJson.LastIndexOf(']');

            if (start == -1 || end == -1 || end <= start)
                throw new Exception("No JSON array found in model output");

            return stringJson.Substring(start, end - start + 1);
        }


        public Task<List<AddExpenseModel>> ConvertStringIntoExpensesFormat(string generatedExpenses)
        {
            using var doc = JsonDocument.Parse(generatedExpenses);

            var generatedText = doc.RootElement
                                    .GetProperty("response")
                                    .GetString();

            if (string.IsNullOrWhiteSpace(generatedText))
                throw new Exception("Model returned empty response");

            // extract only JSON
            var actualExpenses = ExtractJsonArray(generatedText);

            // 1. If it's string-encoded JSON → decode it
            if (actualExpenses.TrimStart().StartsWith("\""))
            {
                actualExpenses = JsonSerializer.Deserialize<string>(actualExpenses);
            }

            // 2. Deserialize partial objects
            var partial = JsonSerializer.Deserialize<List<AddExpenseModel>>(actualExpenses,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

            // 3. Enrich missing fields
            var expenses = partial.Select(x => new AddExpenseModel
            {
                CategoryId = x.CategoryId,
                Amount = x.Amount,
                Currency = x.Currency ?? "LEI",
                PaymentMethod = x.PaymentMethod ?? "",
                PaymentDate = x.PaymentDate == default ? DateTime.UtcNow : x.PaymentDate,
                Merchant = x.Merchant ?? "",
                Description = x.Description ?? "",
                UserEmail = x.UserEmail ?? "none email"
            }).ToList();


            //    var expenses = JsonSerializer.Deserialize<List<AddExpenseModel>>(
            //actualExpenses,
            //new JsonSerializerOptions
            //{
            //    PropertyNameCaseInsensitive = true
            //});
            if (expenses == null || expenses.Count == 0)
                throw new Exception("Failed to deserialize expenses");

            return Task.FromResult(expenses);
        }

        public async Task<string> ExtractExpensesUsingGemini(string userText)
        {
            //string categories = string.Join("; ", _categoryService.GetCategoriesNames().Result);
            string categories = string.Join("; ", _categoryService.GetCategories().Result.Select(x => "Id: " + x.Id + " for category name: " + x.Name));
            //            string categories = string.Join(", ",
            //_categoryService.GetCategories().Result.Select(x =>
            //$"{x.Id}:{x.Name}"));
            var prompt = $@"
                You are an EXPENSE EXTRACTION ENGINE.

                You do NOT talk.
                You do NOT explain.
                You do NOT format text.
                You ONLY return JSON.

                ==================================================
                INPUT RULES
                ==================================================
                Extract expenses from the input text.

                Use ONLY these categories (categoryId is mandatory):
                {categories}

                ==================================================
                OUTPUT RULES (HARD CONSTRAINTS)
                ==================================================
                - Output MUST be valid JSON
                - Output MUST be a JSON array
                - NO markdown
                - NO backticks
                - NO comments
                - NO trailing commas
                - NO explanations
                - NO extra text before or after JSON
                - If output is invalid JSON → it is rejected

                ==================================================
                STRICT OUTPUT FORMAT
                ==================================================
                [
                  {{
                    ""categoryId"": number,
                    ""amount"": number,
                    ""currency"": ""LEI"",
                    ""paymentMethod"": ""Cash"" | ""Card"",
                    ""paymentDate"": ""{DateTime.UtcNow:yyyy-MM-dd}"",
                    ""merchant"": ""string"",
                    ""description"": ""string""
                  }}
                ]

                ==================================================
                FIELD RULES
                ==================================================
                - categoryId: MUST match one of the provided categories
                - amount: numeric only (no text, no currency symbols)
                - currency: always ""LEI"" unless explicitly stated otherwise
                - paymentMethod:
                    - if card, credit card, visa, mastercard → ""Card""
                    - otherwise → ""Cash""
                - paymentDate: use today if not explicitly mentioned
                - merchant:
                    - extract store/service name if present (Lidl, Kaufland, OMV, etc.)
                    - otherwise empty string
                - description:
                    - short phrase like ""groceries"", ""fuel"", ""coffee""

                ==================================================
                INPUT TEXT
                ==================================================
                {userText}
                ";

            //            var prompt = $@"
            //You are a strict JSON generator that Extracts expenses from the text.

            //                Use ONLY these categories:
            //                {categories}

            //               Only output valid JSON. No explanations. No markdown.

            //Do NOT wrap it in quotes.
            //Do NOT escape it.
            //Do NOT use string format.

            //You are NOT allowed to return JSON as a string.
            //Return JSON directly.

            //                Schema:
            //                [
            //                  {{
            //                    ""categoryId"": number, (the id of the correct category from the list above)
            //                    ""amount"": number, 
            //                    ""currency"": string, default value LEI
            //                    ""paymentMethod"": string, values: Cash, Card, default value is Cash
            //                    ""paymentDate"": ""{DateTime.UtcNow:yyyy-MM-dd}"",
            //                    ""merchant"": string, (the name of the store or service where the expense was made, if available in the text, otherwise empty string)
            //                    ""description"": string (a short description of the expense, if available in the text, otherwise empty string)
            //                  }}
            //                ]

            //                Text:
            //                {userText}
            //                ";

            //        RULES:
            //            -Output ONLY valid JSON
            //            - No markdown
            //            - No explanations
            //            - No ``` fences
            //            - No text before or after
            //-Output MUST start with[and end with]

            var requestBody = new
            {
                //model = "tinyllama:latest",
                //model = "mistral:latest",
                //model = "qwen2:1.5b",
                model = "phi3:mini",
                prompt,
                stream = false,
                //options = new
                //{
                //    num_ctx = 2048,
                //    temperature = 0.1
                //}
            };


            //var json = JsonSerializer.Serialize(requestBody);

            //Console.WriteLine(json);

            //var content = new StringContent(
            //    json,
            //    Encoding.UTF8,
            //    "application/json");

            //Console.WriteLine("BEFORE REQUEST");

            //var response = await _httpClient.PostAsync(
            //    "http://127.0.0.1:11434/api/generate",
            //    content);

            //Console.WriteLine("AFTER REQUEST");


            var response = await _httpClient.PostAsJsonAsync(
                                   "http://localhost:11434/api/generate",
                                   requestBody
                                  );

            //response.EnsureSuccessStatusCode();

            var body = await response.Content.ReadAsStringAsync();

            Console.WriteLine(body);

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception(body);
            }

            return body;
        }


        //        public async Task<string> ExtractExpensesUsingGemini(string userText)
        //        {
        //            var apiKey = _config["Gemini:ApiKey"];

        //            //string categories = string.Join("; ", _categoryService.GetCategoriesNames().Result);
        //            //string categories = string.Join("; ", _categoryService.GetCategories().Result.Select(x => "Id: " + x.Id + " for category name: " + x.Name));
        //            string categories = string.Join(", ",
        //_categoryService.GetCategories().Result.Select(x =>
        //$"{x.Id}:{x.Name}"));

        //            var prompt = $@"
        //                Extract expenses from the text.

        //                Use ONLY these categories:
        //                {categories}

        //                Return ONLY valid JSON array.

        //                Schema:
        //                [
        //                  {{
        //                    ""categoryId"": number,
        //                    ""amount"": number,
        //                    ""currency"": ""LEI"",
        //                    ""paymentMethod"": string,
        //                    ""paymentDate"": ""{DateTime.UtcNow:yyyy-MM-dd}"",
        //                    ""merchant"": string,
        //                    ""description"": string
        //                  }}
        //                ]

        //                Text:
        //                {userText}
        //                ";

        //            //var prompt = $@"
        //            //    Extract expenses from this text.

        //            //    Use ONLY these categories (only one for each expense): {categories}

        //            //    Return ONLY raw JSON.
        //            //    Do not use markdown.
        //            //    Do not use ```json.

        //            //    Return ONLY valid JSON array matching this schema:

        //            //    ExpenseModel:
        //            //    -  int CategoryId
        //            //    -  decimal Amount 
        //            //    -  string Currency default LEI
        //            //    -  string PaymentMethod
        //            //    -  DateTime PaymentDate default value is Today's date
        //            //    -  string Merchant 
        //            //    -  string Description 

        //            //    Text:
        //            //    {userText}
        //            //    ";

        //            //ExpenseAiDto:
        //            //    -Category: string
        //            //        -Amount: number
        //            //        - Currency: string
        //            //        -PaymentMethod: string
        //            //        -Merchant: string
        //            //        -Description: string

        //            //-Food
        //            //- Transportation
        //            //- Bills
        //            //- Shopping
        //            //- Entertainment
        //            //- Health
        //            //- Other

        //            var requestBody = new
        //            {
        //                contents = new[]
        //                {
        //                    new
        //                    {
        //                        parts = new[]
        //                        {
        //                            new
        //                            {
        //                                text = prompt
        //                            }
        //                        }
        //                    }
        //                }
        //            };
        //            var url = $"https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key={apiKey}";

        //            //var response = await _httpClient.PostAsJsonAsync(
        //            //    url

        //            //    ,
        //            //    requestBody);

        //            ////response.EnsureSuccessStatusCode();
        //            ////var responseBody = await response.Content.ReadAsStringAsync();
        //            ////Console.WriteLine(responseBody);
        //            ////return await response.Content.ReadAsStringAsync();

        //            //var body = await response.Content.ReadAsStringAsync();

        //            //Console.WriteLine(body);

        //            //if (!response.IsSuccessStatusCode)
        //            //{
        //            //    throw new Exception(body);
        //            //}
        //            //return body;
        //            for (int i = 0; i < 3; i++)
        //            {
        //                var response = await _httpClient.PostAsJsonAsync(url, requestBody);

        //                if (response.IsSuccessStatusCode)
        //                {
        //                    return await response.Content.ReadAsStringAsync();
        //                }

        //                if ((int)response.StatusCode == 429)
        //                {
        //                    await Task.Delay(2000);
        //                    continue;
        //                }

        //                var error = await response.Content.ReadAsStringAsync();
        //                throw new Exception(error);
        //            }

        //            throw new Exception("Gemini quota exceeded");
        //        }



       
    }
}

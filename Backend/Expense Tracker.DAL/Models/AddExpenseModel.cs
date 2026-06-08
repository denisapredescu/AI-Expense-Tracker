using Expense_Tracker.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.Models
{
    public class AddExpenseModel
    {
        //public string Category { get; set; } = "";
        [JsonPropertyName("categoryId")]
        public int CategoryId { get; set; }

        [JsonPropertyName("amount")]
        public decimal Amount { get; set; }

        [JsonPropertyName("currency")]
        public string Currency { get; set; } = "LEI";

        [JsonPropertyName("paymentMethod")]
        public string PaymentMethod { get; set; }

        [JsonPropertyName("paymentDate")]
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;

        [JsonPropertyName("merchant")]
        public string Merchant { get; set; }

        [JsonPropertyName("description")]
        public string Description { get; set; }

        [JsonPropertyName("userEmail")]
        public string UserEmail { get; set; }


    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.Models
{
    public class ExpenseAiDto
    {
        public string Category { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; }
        public string PaymentMethod { get; set; }
        public string Merchant { get; set; }
        public string Description { get; set; }
    }
}

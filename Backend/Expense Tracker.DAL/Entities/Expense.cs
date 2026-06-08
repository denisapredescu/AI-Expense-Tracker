using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.Entities
{
    public class Expense
    {

        public int Id { get; set; }
        public decimal Amount { get; set; }
        public int? CategoryId { get; set; }
        public virtual Category? Category { get; set; }
        public string? Currency { get; set; }
        public string? Description { get; set; }
        public string UserEmail { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PaymentMethod { get; set; }
        public string? Merchant { get; set; }
        public bool? IsRecurring { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

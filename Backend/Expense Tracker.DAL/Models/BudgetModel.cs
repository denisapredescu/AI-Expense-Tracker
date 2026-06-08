using Expense_Tracker.DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.Models
{
    public class BudgetModel
    {
        public int Id { get; set; }
        public decimal MonthlyLimit { get; set; }
        public DateTime BudgetMonth { get; set; }
        public string UserEmail { get; set; }
    }
}

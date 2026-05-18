using Microsoft.CodeAnalysis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.Entities
{
    public class Budget
    {
        //        Budget
        //- Id
        //- UserId
        //- CategoryId(optional)
        //- MonthlyLimit
        //- Month
        //- Year
        public int Id { get; set; }
        public decimal MonthlyLimit { get; set; }
        public int? CategoryId { get; set; }
        public virtual Category Category { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public string UserEmail { get; set; }
    }
}

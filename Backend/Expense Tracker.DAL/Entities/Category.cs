using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.Xml;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}

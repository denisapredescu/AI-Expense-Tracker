using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.Models
{
    public class OpenRouterRequest
    {
        public string model { get; set; }

        public List<OpenRouterMessage> messages { get; set; }

        public bool stream { get; set; } = false;
    }
}

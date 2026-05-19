using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.BLL
{
    public class LoginResult
    {
        public bool Success { get; set; }
        public string AccessToken { get; set; }
    }
}

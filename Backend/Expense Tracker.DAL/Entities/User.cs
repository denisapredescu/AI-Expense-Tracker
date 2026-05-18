using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Expense_Tracker.DAL.Entities
{
    public class User : IdentityUser<int>  //id ul Userului e de tip int
    {
        //public string RefreshToken { get; set; }
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}

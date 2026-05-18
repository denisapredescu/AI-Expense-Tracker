using Microsoft.AspNetCore.Identity;

namespace Expense_Tracker.DAL.Entities
{
    public class Role : IdentityRole<int>
    {
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}
using Microsoft.AspNetCore.Identity;

namespace Expense_Tracker.Modals.Entities
{
    public class Role : IdentityRole<int>
    {
        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}
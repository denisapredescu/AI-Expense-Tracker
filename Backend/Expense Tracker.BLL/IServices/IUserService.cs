using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.Models;

namespace Expense_Tracker.BLL.IServices
{
    public interface IUserService
    {
        Task<String> Register(RegisterModel registerModel);
        Task<LoginResult> Login(LoginModel loginModel);
    }
}

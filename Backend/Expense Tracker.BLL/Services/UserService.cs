using Expense_Tracker.BLL.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Expense_Tracker.DAL.Entities;
using Expense_Tracker.DAL.Models;
using Expense_Tracker.DAL.IRepositories;
using Microsoft.AspNetCore.Identity;
namespace Expense_Tracker.BLL.Services
{
    public class UserService: IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenHelper _tokenHelper;

        public UserService(
           UserManager<User> userManager, 
           SignInManager<User> signInManager,
           ITokenHelper tokenHelper
            )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenHelper = tokenHelper;
        }

        public async Task<string> Register(RegisterModel registerModel)
        {
            var user = new User
            {
                Email = registerModel.Email,
                UserName = registerModel.Email
            }; //nu pun aici parola ca sa stie care este parola si sa o cripteze

            var result = await _userManager.CreateAsync(user, registerModel.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, registerModel.Role);

                return "true";
            }

            return result.Errors.First().Code;
        }

        public async Task<LoginResult> Login(LoginModel loginModel)
        {
            var user = await _userManager.FindByEmailAsync(loginModel.Email);

            if (user == null)
                return new LoginResult
                {
                    Success = false
                };  //nu exista userul in baza de date

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginModel.Password, false);  //false - ca sa ne lase sa incercam la infinit

            if (result.Succeeded)
            {
                var token = await _tokenHelper.CreateAccessToken(user);
                //var refreshToken = _tokenHelper.CreateRefreshToken();

                //user.RefreshToken = refreshToken;
                await _userManager.UpdateAsync(user);

                return new LoginResult
                {
                    Success = true,
                    AccessToken = token,
                    //RefreshToken = refreshToken
                };
            }
            else
                return new LoginResult
                {
                    Success = false
                };  //nu a fost succesful

        }

    }
}

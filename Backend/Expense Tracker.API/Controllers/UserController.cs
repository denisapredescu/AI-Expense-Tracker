using Expense_Tracker.BLL;
using Expense_Tracker.BLL.IServices;
using Expense_Tracker.DAL.Models;
using Microsoft.AspNetCore.Mvc;

namespace Expense_Tracker.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterModel registerModel)
        {
            String result = await _userService.Register(registerModel);

            if (result != "true")
            {
                return BadRequest("User registration failed: " + result);
            }
            return Ok();
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginModel loginModel)
        {

            LoginResult result = await _userService.Login(loginModel);
            if (!result.Success)
            {
                return Unauthorized("Invalid email or password.");
            }
            return Ok(result);
           

        }


    }
}

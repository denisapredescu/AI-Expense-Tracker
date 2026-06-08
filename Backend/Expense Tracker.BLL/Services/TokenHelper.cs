using Expense_Tracker.BLL.IServices;
using Expense_Tracker.DAL.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration;


namespace Expense_Tracker.BLL.Services
{
    public class TokenHelper : ITokenHelper
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;  //este deja creat de de acel pachet Identity

        public TokenHelper(IConfiguration configuration,
            UserManager<User> userManager)  //sunt deja adaugate in StartUp
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<string> CreateAccessToken(User user)
        {
            var userId = user.Id.ToString();
            var userName = user.UserName;
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Name, userName)
            };

            var roles = await _userManager.GetRolesAsync(user);    //lista de stringuri care contine numele rolurilor pe care le are userul resp.

            foreach (var role in roles)
                claims.Add(new Claim(ClaimTypes.Role, role));

            //dupa login primim un AccesToken

            var secret = _configuration.GetSection("Jwt").GetSection("Token").Get<string>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);  //codificam

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddMinutes(10),       //10 min
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();  //Handler = servicii folosite de noi in diferite aplicatii

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);  //transforma un string cu AccesToken-ul nostru
        }


        public string CreateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string _Token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                RequireExpirationTime = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Token"])),
                ValidateIssuer = false,
                ValidateAudience = false
            };
            IdentityModelEventSource.ShowPII = true;
            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken securityToken;

            var principal = tokenHandler.ValidateToken(_Token, tokenValidationParameters, out securityToken);
            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals("hs256", StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }
    }
}

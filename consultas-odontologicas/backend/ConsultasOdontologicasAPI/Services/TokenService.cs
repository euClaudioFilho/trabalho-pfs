using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ConsultasOdontologicasAPI.Models;
using Microsoft.IdentityModel.Tokens;

namespace ConsultasOdontologicasAPI.Services
{
    public class TokenService
    {
        private static readonly string Key = "123456789123456789123456789123456789";

        public static string GenerateToken(int userId, string role)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(GetTokenDescriptor(userId, role));
            return tokenHandler.WriteToken(token);
        }

        private static SecurityTokenDescriptor GetTokenDescriptor(int userId, string role)
        {
            return new SecurityTokenDescriptor
            {
                Subject = GerarClaims(userId, role),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = GetSigningCredentials()
            };
        }

        private static SigningCredentials GetSigningCredentials()
        {
            var key = Encoding.ASCII.GetBytes(Key);

            return new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            );
        }

        private static ClaimsIdentity GerarClaims(int userId, string role)
        {
            var claimsIdentity = new ClaimsIdentity();

            claimsIdentity.AddClaim(new Claim(ClaimTypes.Name, userId.ToString()));
            claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, role));

            return claimsIdentity;
        }
    }
}

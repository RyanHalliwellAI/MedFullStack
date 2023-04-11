using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly string _connectionString;

        public AccountController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("MedAppCon");
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateAccount([FromBody] AccountRequest request)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                // Check if the username or email exists in Database
                var checkQuery = "SELECT COUNT(*) FROM Users WHERE Username = @Username OR Email = @Email";
                using (var command = new SqlCommand(checkQuery, connection))
                {
                    command.Parameters.AddWithValue("@Username", request.Username);
                    command.Parameters.AddWithValue("@Email", request.Email);

                    var count = (int)await command.ExecuteScalarAsync();
                    if (count > 0)
                    {
                        return BadRequest("Account name or email already exists within system");
                    }
                }
                // Insert new user to Database
                var insertQuery = "INSERT INTO Users (Username, Email, PasswordHash, UserRole) VALUES (@Username, @Email, @PasswordHash, @UserRole)";
                using (var command = new SqlCommand(insertQuery, connection))
                {
                    command.Parameters.AddWithValue("@Username", request.Username);
                    command.Parameters.AddWithValue("@Email", request.Email);
                    command.Parameters.AddWithValue("@PasswordHash", request.PasswordHash); //will hash later
                    command.Parameters.AddWithValue("@UserRole", request.UserRole);


                    await command.ExecuteNonQueryAsync();
                }

            }
            return Ok("Account created!");

        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginToAccount([FromBody] AccountRequestLogin request)
        {
            string email;
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                // Check if the username or email exists in Database
                var checkQuery = "SELECT PasswordHash, UserRole FROM Users WHERE Email = @Email";
                using (var command = new SqlCommand(checkQuery, connection))
                {
                    command.Parameters.AddWithValue("@Email", request.Email);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            var storedPasswordHash = reader["PasswordHash"].ToString();
                            var userRole = reader["UserRole"].ToString();


                            // Compare provided password hash with stored hash
                            if (storedPasswordHash != request.PasswordHash)
                            {
                                return Unauthorized("Invalid password.");
                            }

                            // Login successful
                            return Ok(new { email = request.Email, role = userRole });
                        }
                        else
                        {
                            return Unauthorized("Invalid Email.");
                        }

                    }
                }
            }

        }

        public class AccountRequest
        {
            public string Username { get; set; }
            public string Email { get; set; }
            public string PasswordHash { get; set; }
            public string UserRole { get; set; }
        }

        public class AccountRequestLogin
        {
            public string Email { get; set; }
            public string PasswordHash { get; set; }

        }


    }
}

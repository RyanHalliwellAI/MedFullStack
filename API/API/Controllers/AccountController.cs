using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
                var insertQuery = "INSERT INTO Users (Username, Email, PasswordHash) VALUES (@Username, @Email, @PasswordHash)";
                using (var command = new SqlCommand(insertQuery, connection))
                {
                    command.Parameters.AddWithValue("@Username", request.Username);
                    command.Parameters.AddWithValue("@Email", request.Email);
                    command.Parameters.AddWithValue("@PasswordHash", request.PasswordHash); //will hash later

                    await command.ExecuteNonQueryAsync();
                }

            }
            return Ok("Account created!");

        }
        public class AccountRequest
        {
            public string Username { get; set; }
            public string Email { get; set; }
            public string PasswordHash { get; set; }
        }
    }
}

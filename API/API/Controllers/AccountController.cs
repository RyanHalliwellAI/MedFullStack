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
        [HttpPost("appointment/create")]
        public async Task<IActionResult> CreateAppointment([FromBody] Appointment request)
        {
            if (request == null)
            {
                return BadRequest("Appointment data is required.");
            }
            if (string.IsNullOrEmpty(request.Doctor) ||
                 string.IsNullOrEmpty(request.PatientName) ||
                 request.AppointmentDate == default ||
                 string.IsNullOrEmpty(request.Description))
            {
                return BadRequest("All fields are required.");
            }

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var insertQuery = "INSERT INTO Appointments (Doctor, PatientName, AppointmentDate, Description) VALUES (@Doctor, @PatientName, @AppointmentDate, @Description)";
                using (var command = new SqlCommand(insertQuery, connection))
                {
                    command.Parameters.AddWithValue("@Doctor", request.Doctor);
                    command.Parameters.AddWithValue("@PatientName", request.PatientName);
                    command.Parameters.AddWithValue("@AppointmentDate", request.AppointmentDate);
                    command.Parameters.AddWithValue("@Description", request.Description);

                    try
                    {
                        await command.ExecuteNonQueryAsync();
                    }
                    catch (SqlException ex)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, "Database operation failed.");

                    }

                }
            }
            return Ok("Appointment created!");
        }

        [HttpGet("appointment")]
        public async Task<IActionResult> GetAppointments()
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var query = "SELECT * FROM Appointments";
                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var appointments = new List<Appointment>();
                        while (await reader.ReadAsync())
                        {
                            appointments.Add(new Appointment
                            {
                                AppointmentId = reader.GetInt32(0),
                                Doctor = reader.GetString(1),
                                PatientName = reader.GetString(2),
                                AppointmentDate = reader.GetDateTime(3),
                                Description = reader.GetString(4)
                            });
                        }
                        return Ok(appointments);
                    }
                }
            }
        }

        [HttpPut("appointment/update")]
        public async Task<IActionResult> UpdateAppointment([FromBody] Appointment request)
        {
            if (request == null)
            {
                return BadRequest("Appointment data is required.");
            }
            if (request.AppointmentId <= 0 ||
                string.IsNullOrEmpty(request.Doctor) ||
                string.IsNullOrEmpty(request.PatientName) ||
                request.AppointmentDate == default ||
                string.IsNullOrEmpty(request.Description))
            {
                return BadRequest("All fields are required and appointment ID must be valid.");
            }

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var updateQuery = @"
                    UPDATE Appointments
                    SET Doctor = @Doctor, 
                        PatientName = @PatientName, 
                        AppointmentDate = @AppointmentDate, 
                        Description = @Description
                    WHERE AppointmentId = @AppointmentId";

                using (var command = new SqlCommand(updateQuery, connection))
                {
                    command.Parameters.AddWithValue("@AppointmentId", request.AppointmentId);
                    command.Parameters.AddWithValue("@Doctor", request.Doctor);
                    command.Parameters.AddWithValue("@PatientName", request.PatientName);
                    command.Parameters.AddWithValue("@AppointmentDate", request.AppointmentDate);
                    command.Parameters.AddWithValue("@Description", request.Description);

                    try
                    {
                        var rowsAffected = await command.ExecuteNonQueryAsync();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Appointment not found.");
                        }
                    }
                    catch (SqlException ex)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, "Database operation failed.");
                    }
                }
            }
            return Ok("Appointment updated successfully!");
        }

        [HttpDelete("appointment/delete/{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid appointment ID.");
            }

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var deleteQuery = "DELETE FROM Appointments WHERE AppointmentId = @AppointmentId";
                using (var command = new SqlCommand(deleteQuery, connection))
                {
                    command.Parameters.AddWithValue("@AppointmentId", id);

                    try
                    {
                        var rowsAffected = await command.ExecuteNonQueryAsync();
                        if (rowsAffected == 0)
                        {
                            return NotFound("Appointment not found.");
                        }
                    }
                    catch (SqlException ex)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, "Database operation failed.");
                    }
                }
            }

            return Ok("Appointment deleted successfully!");
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
        public class Appointment
        {
            public int AppointmentId { get; set; }
            public string Doctor { get; set; }
            public string PatientName { get; set; }
            public DateTime AppointmentDate { get; set; }
            public string Description { get; set; }
        }


    }
}

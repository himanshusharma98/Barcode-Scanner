using BarCode_ScannerAPI.DbContext;
using BarCode_ScannerAPI.Modals;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BarCode_ScannerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BarcodeQRCodeController : ControllerBase
    {
        private readonly AppDbContext _dbContext;
        private readonly IConfiguration _configuration;

        public BarcodeQRCodeController(AppDbContext dbContext, IConfiguration configuration)
        {
            _dbContext = dbContext;
            _configuration = configuration;
        }

        // JWT Token Generation Method
        private string GenerateJwtToken(string username)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, username)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] User user)
        {
            try
            {
                if (_dbContext.Users.Any(u => u.Username == user.Username))
                {
                    return BadRequest(new { message = "Username already exists." });
                }

                // Store password directly (no hashing)
                await _dbContext.Users.AddAsync(user);
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "User registered successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User user)
        {
            try
            {
                var existingUser = _dbContext.Users.FirstOrDefault(u => u.Username == user.Username);
                if (existingUser == null || existingUser.Password != user.Password)
                {
                    return Unauthorized(new { message = "Invalid username or password." });
                }

                var token = GenerateJwtToken(existingUser.Username);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddScannedData([FromBody] ScannedData data)
        {
            try
            {
                data.Timestamp = DateTime.UtcNow;
                await _dbContext.ScannedData.AddAsync(data);
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Data added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("fetch")]
        public IActionResult FetchScannedData()
        {
            try
            {
                var data = _dbContext.ScannedData
                    .OrderByDescending(d => d.Timestamp)
                    .ToList();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("download")]
        public IActionResult DownloadExcel()
        {
            try
            {
                var data = _dbContext.ScannedData.ToList();
                var workbook = new XLWorkbook();
                var worksheet = workbook.Worksheets.Add("ScannedData");

                worksheet.Cell(1, 1).Value = "Id";
                worksheet.Cell(1, 2).Value = "CodeType";
                worksheet.Cell(1, 3).Value = "CodeValue";
                worksheet.Cell(1, 4).Value = "Timestamp";

                for (int i = 0; i < data.Count; i++)
                {
                    worksheet.Cell(i + 2, 1).Value = data[i].Id;
                    worksheet.Cell(i + 2, 2).Value = data[i].CodeType;
                    worksheet.Cell(i + 2, 3).Value = data[i].CodeValue;
                    worksheet.Cell(i + 2, 4).Value = data[i].Timestamp.ToString("yyyy-MM-dd HH:mm:ss");
                }

                var stream = new MemoryStream();
                workbook.SaveAs(stream);
                stream.Position = 0;

                return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ScannedData.xlsx");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteScannedData(int id)
        {
            try
            {
                var data = await _dbContext.ScannedData.FindAsync(id);
                if (data == null)
                {
                    return NotFound(new { message = "Data not found." });
                }

                _dbContext.ScannedData.Remove(data);
                await _dbContext.SaveChangesAsync();
                return Ok(new { message = "Data deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}

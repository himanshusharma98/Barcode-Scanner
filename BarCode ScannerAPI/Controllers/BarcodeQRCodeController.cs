using BarCode_ScannerAPI.DbContext;
using BarCode_ScannerAPI.Modals;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;

namespace BarCode_ScannerAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BarcodeQRCodeController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public BarcodeQRCodeController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

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

        [HttpGet("fetch")]
        public IActionResult FetchScannedData(int page = 1, int pageSize = 10)
        {
            try
            {
                var data = _dbContext.ScannedData
                    .OrderByDescending(d => d.Timestamp)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();
                return Ok(data);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("download")]
        public IActionResult DownloadExcel()
        {
            var data = _dbContext.ScannedData.ToList();
            var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("ScannedData");

            // Header row
            worksheet.Cell(1, 1).Value = "Id";
            worksheet.Cell(1, 2).Value = "CodeType";
            worksheet.Cell(1, 3).Value = "CodeValue";
            worksheet.Cell(1, 4).Value = "Timestamp";

            // Populate rows
            for (int i = 0; i < data.Count; i++)
            {
                worksheet.Cell(i + 2, 1).Value = data[i].Id;
                worksheet.Cell(i + 2, 2).Value = data[i].CodeType;
                worksheet.Cell(i + 2, 3).Value = data[i].CodeValue;
                worksheet.Cell(i + 2, 4).Value = data[i].Timestamp;
            }

            var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;

            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ScannedData.xlsx");
        }

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

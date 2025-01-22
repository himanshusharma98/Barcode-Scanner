using BarCode_ScannerAPI.DbContext;
using BarCode_ScannerAPI.Modals;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

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
        public IActionResult FetchScannedData()
        {
            try
            {
                var data = _dbContext.ScannedData.ToList();
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
            var workbook = new ClosedXML.Excel.XLWorkbook();
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
    }
}

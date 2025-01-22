using BarCode_ScannerAPI.Modals;
using Microsoft.EntityFrameworkCore;

namespace BarCode_ScannerAPI.DbContext
{
    public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext 
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<ScannedData> ScannedData { get; set; }
    }
}

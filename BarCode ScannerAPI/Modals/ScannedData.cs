namespace BarCode_ScannerAPI.Modals
{

    public class ScannedData
    {
        public int Id { get; set; }
        public required string CodeType { get; set; }
        public required string CodeValue { get; set; }
        public DateTime Timestamp { get; set; }
    }
}


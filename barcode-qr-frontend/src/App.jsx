import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Typography,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";

const App = () => {
    const [codeType, setCodeType] = useState("Barcode");
    const [codeValue, setCodeValue] = useState("");
    const [scannedData, setScannedData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [codeValueError, setCodeValueError] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const filteredData = scannedData.filter(
        (item) =>
            item.codeType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.codeValue.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const fetchScannedData = async () => {
        try {
            const response = await axios.get(`https://localhost:7272/api/BarcodeQRCode/fetch`);
            setScannedData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch data.");
        }
    };

    useEffect(() => {
        fetchScannedData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!codeValue.trim()) {
            setCodeValueError(true);
            return;
        }

        try {
            await axios.post("https://localhost:7272/api/BarcodeQRCode/add", {
                codeType,
                codeValue,
            });
            alert("Data added successfully!");
            setCodeValue("");
            setCodeValueError(false);
            fetchScannedData();
        } catch (error) {
            console.error("Error adding data:", error);
            alert("Failed to add data.");
        }
    };

    const handleDownload = () => {
        window.open("https://localhost:7272/api/BarcodeQRCode/download", "_blank");
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://localhost:7272/api/BarcodeQRCode/delete/${id}`);
            alert("Data deleted successfully!");
            fetchScannedData();
        } catch (error) {
            console.error("Error deleting data:", error);
            alert("Failed to delete data.");
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom textAlign="center" color="primary">
                Barcode/QRCode Scanner
            </Typography>
            <Grid container spacing={4} sx={{ mt: 3 }}>
                <Grid item xs={12} md={6}>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
                        <Typography variant="h5" gutterBottom>
                            Add New Code
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            label="Code Type"
                            value={codeType}
                            onChange={(e) => setCodeType(e.target.value)}
                            margin="normal"
                        >
                            <MenuItem value="Barcode">Barcode</MenuItem>
                            <MenuItem value="QRCode">QRCode</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            label="Code Value"
                            value={codeValue}
                            onChange={(e) => {
                                setCodeValue(e.target.value);
                                if (e.target.value.trim()) setCodeValueError(false);
                            }}
                            margin="normal"
                            required
                            error={codeValueError}
                            helperText={codeValueError ? "Code Value is required" : ""}
                        />
                        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                            <Button type="submit" variant="contained" color="primary" startIcon={<AddCircleIcon />}>
                                Add Data
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h5" color="textSecondary">
                            Scanned Data
                        </Typography>
                        <Button variant="contained" color="secondary" onClick={handleDownload} startIcon={<FileDownloadIcon />}>
                            Export to Excel
                        </Button>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                        {!isSearchVisible ? (
                            <Button variant="outlined" onClick={() => setIsSearchVisible(true)}>
                                Search
                            </Button>
                        ) : (
                            <TextField
                                placeholder="Search by Code Type or Value"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onBlur={() => setIsSearchVisible(false)} // Hides the bar on losing focus
                                variant="outlined"
                                sx={{
                                    width: "300px",
                                    backgroundColor: "#f5f5f5",
                                    borderRadius: "50px",
                                }}
                            />
                        )}
                    </Box>
                    <TableContainer
                        component={Paper}
                        sx={{
                            boxShadow: 3,
                            borderRadius: 2,
                            maxHeight: "400px",
                            overflowY: "auto",
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", borderRadius: "8px 0 0 8px" }}>
                                        ID
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Code Type</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Code Value</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Timestamp</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", borderRadius: "0 8px 8px 0" }}>
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((data, index) => (
                                    <TableRow
                                        key={data.id}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
                                            "&:last-child td": { border: 0 },
                                        }}
                                    >
                                        <TableCell>{data.id}</TableCell>
                                        <TableCell>{data.codeType}</TableCell>
                                        <TableCell sx={{ wordBreak: "break-word" }}>{data.codeValue}</TableCell>
                                        <TableCell>{new Date(data.timestamp).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                                onClick={() => handleDelete(data.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>
    );
};

export default App;

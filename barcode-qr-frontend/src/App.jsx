import React, { useState, useEffect } from "react";
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
    Pagination,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";

const App = () => {
    const [codeType, setCodeType] = useState("Barcode");
    const [codeValue, setCodeValue] = useState("");
    const [scannedData, setScannedData] = useState([]);
    const [currentPageData, setCurrentPageData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const recordsPerPage = 5; // Set to 5 records per page

    const fetchScannedData = async () => {
        try {
            const response = await axios.get(`https://localhost:7272/api/BarcodeQRCode/fetch`);
            const fetchedData = response.data;
            setScannedData(fetchedData);
            setTotalRecords(fetchedData.length);
            setCurrentPageData(fetchedData.slice(0, recordsPerPage));
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch data.");
        }
    };

    useEffect(() => {
        fetchScannedData();
    }, []);

    useEffect(() => {
        const startIndex = (page - 1) * recordsPerPage;
        const endIndex = startIndex + recordsPerPage;
        setCurrentPageData(scannedData.slice(startIndex, endIndex));
    }, [page, scannedData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://localhost:7272/api/BarcodeQRCode/add", {
                codeType,
                codeValue,
            });
            alert("Data added successfully!");
            setCodeValue("");
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
                {/* Form Section */}
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
                            onChange={(e) => setCodeValue(e.target.value)}
                            margin="normal"
                            required
                        />
                        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                            <Button type="submit" variant="contained" color="primary" startIcon={<AddCircleIcon />}>
                                Add Data
                            </Button>
                        </Box>
                    </Box>
                </Grid>

                {/* Table Section */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h5" color="textSecondary">
                            Scanned Data
                        </Typography>
                        <Button variant="contained" color="secondary" onClick={handleDownload} startIcon={<FileDownloadIcon />}>
                            Export to Excel
                        </Button>
                    </Box>
                    <TableContainer
                        component={Paper}
                        sx={{
                            boxShadow: 3,
                            borderRadius: 2,
                            overflowX: "auto", // Ensure smooth scrolling for very small screens
                            width: "100%", // Occupy the full width of the container
                        }}
                    >
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", width: "10%" }}>ID</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", width: "20%" }}>Code Type</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", width: "35%" }}>Code Value</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", width: "25%" }}>Timestamp</TableCell>
                                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", width: "10%" }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentPageData.map((data, index) => (
                                    <TableRow
                                        key={data.id}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
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
                    <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                        <Pagination
                            count={Math.ceil(totalRecords / recordsPerPage)}
                            page={page}
                            onChange={(e, value) => setPage(value)}
                            color="primary"
                        />
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default App;

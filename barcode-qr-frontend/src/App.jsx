import React, { useState } from "react";
import axios from "axios";
import { Box, Button, TextField, MenuItem, Typography, Container } from "@mui/material";

const App = () => {
    const [codeType, setCodeType] = useState("Barcode");
    const [codeValue, setCodeValue] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://localhost:7272/api/BarcodeQRCode/add", {
                codeType,
                codeValue,
            });
            alert("Data added successfully!");
            setCodeValue("");
        } catch (error) {
            console.error("Error adding data:", error);
            alert("Failed to add data.");
        }
    };

    const handleDownload = () => {
        window.open("https://localhost:7272/api/BarcodeQRCode/download", "_blank");
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Typography variant="h4" gutterBottom>
                Barcode/QRCode Scanner
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
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
                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                    <Button type="submit" variant="contained" color="primary">
                        Submit
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleDownload}>
                        Download Excel
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default App;

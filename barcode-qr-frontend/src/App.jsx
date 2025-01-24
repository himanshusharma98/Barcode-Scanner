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
    Card,
    CardContent,
    Divider,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

const App = () => {
    const [codeType, setCodeType] = useState("Barcode");
    const [codeValue, setCodeValue] = useState("");
    const [scannedData, setScannedData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [codeValueError, setCodeValueError] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signUpUsername, setSignUpUsername] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [loginError, setLoginError] = useState("");
    const [signUpError, setSignUpError] = useState("");

    const filteredData = scannedData.filter(
        (item) =>
            item.codeType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.codeValue.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const fetchScannedData = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`https://localhost:7272/api/BarcodeQRCode/fetch`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setScannedData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to fetch data.");
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchScannedData();
        }
    }, [isAuthenticated]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!codeValue.trim()) {
            setCodeValueError(true);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "https://localhost:7272/api/BarcodeQRCode/add",
                {
                    codeType,
                    codeValue,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
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
            const token = localStorage.getItem("token");
            await axios.delete(`https://localhost:7272/api/BarcodeQRCode/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Data deleted successfully!");
            fetchScannedData();
        } catch (error) {
            console.error("Error deleting data:", error);
            alert("Failed to delete data.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");
        try {
            const response = await axios.post("https://localhost:7272/api/BarcodeQRCode/login", {
                username: loginUsername,
                password: loginPassword,
            });
            localStorage.setItem("token", response.data.token);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error logging in:", error);
            setLoginError("Failed to log in. Please check your credentials.");
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setSignUpError("");
        if (signUpPassword !== confirmPassword) {
            setPasswordError(true);
            return;
        }
        try {
            await axios.post("https://localhost:7272/api/BarcodeQRCode/signup", {
                username: signUpUsername,
                password: signUpPassword,
            });
            alert("User registered successfully!");
            setSignUpUsername("");
            setSignUpPassword("");
            setConfirmPassword("");
            setPasswordError(false);
        } catch (error) {
            console.error("Error signing up:", error);
            setSignUpError("Failed to sign up. Please try again.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            {!isAuthenticated ? (
                <Box>
                    <Typography variant="h4" textAlign="center" color="primary" sx={{ fontWeight: "bold", mb: 3 }}>
                        Login / Sign Up
                    </Typography>
                    <Card sx={{ boxShadow: 3, borderRadius: 2, mb: 3 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Login
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box component="form" onSubmit={handleLogin} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={loginUsername}
                                    onChange={(e) => setLoginUsername(e.target.value)}
                                    variant="outlined"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    variant="outlined"
                                    required
                                />
                                {loginError && <Typography color="error">{loginError}</Typography>}
                                <Button type="submit" variant="contained" color="primary" size="large">
                                    Login
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Sign Up
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box component="form" onSubmit={handleSignUp} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    value={signUpUsername}
                                    onChange={(e) => setSignUpUsername(e.target.value)}
                                    variant="outlined"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={signUpPassword}
                                    onChange={(e) => setSignUpPassword(e.target.value)}
                                    variant="outlined"
                                    required
                                />
                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    variant="outlined"
                                    required
                                    error={passwordError}
                                    helperText={passwordError ? "Passwords do not match" : ""}
                                />
                                {signUpError && <Typography color="error">{signUpError}</Typography>}
                                <Button type="submit" variant="contained" color="secondary" size="large">
                                    Sign Up
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            ) : (
                <Box>
                    <Typography variant="h4" textAlign="center" color="primary" sx={{ fontWeight: "bold", mb: 3 }}>
                        Barcode/QRCode Scanner
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mb: 3 }}>
                        Logout
                    </Button>
                    <Grid container spacing={4}>
                        {/* Form Section */}
                        <Grid item xs={12} md={6}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                        Add New Code
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Code Type"
                                            value={codeType}
                                            onChange={(e) => setCodeType(e.target.value)}
                                            variant="outlined"
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
                                            required
                                            error={codeValueError}
                                            helperText={codeValueError ? "Code Value is required" : ""}
                                            variant="outlined"
                                        />
                                        <Button type="submit" variant="contained" color="primary" startIcon={<AddCircleIcon />} size="large">
                                            Add Data
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Table Section */}
                        <Grid item xs={12} md={6}>
                            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography variant="h5">Scanned Data</Typography>
                                        <Button variant="contained" color="secondary" onClick={handleDownload} startIcon={<FileDownloadIcon />}>
                                            Export to Excel
                                        </Button>
                                    </Box>
                                    <Box sx={{ mb: 2 }}>
                                        {!isSearchVisible ? (
                                            <Button variant="outlined" startIcon={<SearchIcon />} onClick={() => setIsSearchVisible(true)}>
                                                Search
                                            </Button>
                                        ) : (
                                            <TextField
                                                placeholder="Search by Code Type or Value"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onBlur={() => setIsSearchVisible(false)}
                                                variant="outlined"
                                                fullWidth
                                                size="small"
                                                sx={{ backgroundColor: "#f9f9f9", borderRadius: 1 }}
                                            />
                                        )}
                                    </Box>
                                    <TableContainer component={Paper} sx={{ maxHeight: 400, boxShadow: 0, borderRadius: 2, overflowY: "auto" }}>
                                        <Table stickyHeader>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>Code Type</TableCell>
                                                    <TableCell>Code Value</TableCell>
                                                    <TableCell>Timestamp</TableCell>
                                                    <TableCell align="center">Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredData.map((data) => (
                                                    <TableRow key={data.id}>
                                                        <TableCell>{data.id}</TableCell>
                                                        <TableCell>{data.codeType}</TableCell>
                                                        <TableCell sx={{ wordBreak: "break-word" }}>{data.codeValue}</TableCell>
                                                        <TableCell>{new Date(data.timestamp).toLocaleString()}</TableCell>
                                                        <TableCell align="center">
                                                            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(data.id)}>
                                                                Delete
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Container>
    );
};

export default App;

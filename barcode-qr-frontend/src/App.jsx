import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    AppBar,
    Toolbar,
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
    CircularProgress,
    InputAdornment,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import QrCodeScanner from './QrCodeScanner';
import { BrowserMultiFormatReader } from '@zxing/library';


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
    const [loggedInUsername, setLoggedInUsername] = useState("");
    const [loginUsernameError, setLoginUsernameError] = useState(false);
    const [loginPasswordError, setLoginPasswordError] = useState(false);
    const [signUpUsernameError, setSignUpUsernameError] = useState(false);
    const [signUpPasswordError, setSignUpPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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
            setCodeValue("");
            setCodeValueError(false);
            fetchScannedData();
        } catch (error) {
            console.error("Error adding data:", error);
        }
    };

    const handleDownload = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("https://localhost:7272/api/BarcodeQRCode/download", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "scanned_data.xlsx");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading file:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`https://localhost:7272/api/BarcodeQRCode/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchScannedData();
        } catch (error) {
            console.error("Error deleting data:", error);
            alert("Failed to delete data.");
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError("");
        setLoginUsernameError(false);
        setLoginPasswordError(false);

        if (!loginUsername.trim()) {
            setLoginUsernameError(true);
            return;
        }

        if (!loginPassword.trim()) {
            setLoginPasswordError(true);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("https://localhost:7272/api/BarcodeQRCode/login", {
                username: loginUsername,
                password: loginPassword,
            });
            localStorage.setItem("token", response.data.token);
            setIsAuthenticated(true);
            setLoggedInUsername(loginUsername);
        } catch (error) {
            console.error("Error logging in:", error);
            setLoginError("Failed to log in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setSignUpError("");
        setSignUpUsernameError(false);
        setSignUpPasswordError(false);
        setConfirmPasswordError(false);

        if (!signUpUsername.trim()) {
            setSignUpUsernameError(true);
            return;
        }

        if (!signUpPassword.trim()) {
            setSignUpPasswordError(true);
            return;
        }

        if (!confirmPassword.trim()) {
            setConfirmPasswordError(true);
            return;
        }

        if (signUpPassword !== confirmPassword) {
            setPasswordError(true);
            return;
        }

        setLoading(true);

        try {
            await axios.post("https://localhost:7272/api/BarcodeQRCode/signup", {
                username: signUpUsername,
                password: signUpPassword,
            });
            alert("User  registered successfully!");
            setSignUpUsername("");
            setSignUpPassword("");
            setConfirmPassword("");
            setPasswordError(false);
        } catch (error) {
            console.error("Error signing up:", error);
            setSignUpError("Failed to sign up. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setLoggedInUsername("");
    };

    const handleScan = async () => {
        const codeReader = new BrowserMultiFormatReader();
        try {
            const result = await codeReader.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
                if (result) {
                    setCodeValue(result.getText());
                    setCodeType("QRCode");
                    setIsScannerOpen(false);
                    codeReader.reset();
                }
                if (error) {
                    console.error(error);
                }
            });
        } catch (error) {
            console.error("Error scanning code:", error);
        }
    };

    useEffect(() => {
        if (isScannerOpen) {
            handleScan();
        }
    }, [isScannerOpen]);

    // Function to handle delete confirmation
    const handleDeleteConfirmation = () => {
        if (deleteId) {
            handleDelete(deleteId);
            setDeleteId(null); // Reset deleteId after deletion
        }
        setIsDeleteDialogOpen(false); // Close the dialog
    };

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Barcode/QRCode Scanner
                    </Typography>
                    {isAuthenticated && (
                        <>
                            <Typography variant="subtitle1" sx={{ mr: 2 }}>
                                Welcome, {loggedInUsername}
                            </Typography>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" sx={{ flexGrow: 1, mt: 2 }}>
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : !isAuthenticated ? (
                    <Box>
                        <Grid container spacing={4} justifyContent="center">
                            <Grid item xs={12} md={6}>
                                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="h4" gutterBottom align="center">
                                            Login
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box
                                            component="form"
                                            onSubmit={handleLogin}
                                            noValidate
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 2,
                                            }}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Username"
                                                value={loginUsername}
                                                onChange={(e) =>
                                                    setLoginUsername(e.target.value)
                                                }
                                                variant="outlined"
                                                required
                                                error={loginUsernameError}
                                                helperText={
                                                    loginUsernameError
                                                        ? "Username is required"
                                                        : ""
                                                }
                                            />
                                            <TextField
                                                fullWidth
                                                label="Password"
                                                type="password"
                                                value={loginPassword}
                                                onChange={(e) =>
                                                    setLoginPassword(e.target.value)
                                                }
                                                variant="outlined"
                                                required
                                                error={loginPasswordError}
                                                helperText={
                                                    loginPasswordError
                                                        ? "Password is required"
                                                        : ""
                                                }
                                            />
                                            {loginError && (
                                                <Typography color="error" align="center">
                                                    {loginError}
                                                </Typography>
                                            )}
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                            >
                                                Login
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="h4" gutterBottom align="center">
                                            Sign Up
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box
                                            component="form"
                                            onSubmit={handleSignUp}
                                            noValidate
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 2,
                                            }}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Username"
                                                value={signUpUsername}
                                                onChange={(e) =>
                                                    setSignUpUsername(e.target.value)
                                                }
                                                variant="outlined"
                                                required
                                                error={signUpUsernameError}
                                                helperText={
                                                    signUpUsernameError
                                                        ? "Username is required"
                                                        : ""
                                                }
                                            />
                                            <TextField
                                                fullWidth
                                                label="Password"
                                                type="password"
                                                value={signUpPassword}
                                                onChange={(e) =>
                                                    setSignUpPassword(e.target.value)
                                                }
                                                variant="outlined"
                                                required
                                                error={signUpPasswordError}
                                                helperText={
                                                    signUpPasswordError
                                                        ? "Password is required"
                                                        : ""
                                                }
                                            />
                                            <TextField
                                                fullWidth
                                                label="Confirm Password"
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(e.target.value)
                                                }
                                                variant="outlined"
                                                required
                                                error={confirmPasswordError || passwordError}
                                                helperText={
                                                    confirmPasswordError
                                                        ? "Confirm Password is required"
                                                        : passwordError
                                                            ? "Passwords do not match"
                                                            : ""
                                                }
                                            />
                                            {signUpError && (
                                                <Typography color="error" align="center">
                                                    {signUpError}
                                                </Typography>
                                            )}
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="secondary"
                                                size="large"
                                            >
                                                Sign Up
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                ) : (
                    <Box>
                        <Grid container spacing={4}>
                            {/* Form Section */}
                            <Grid item xs={12} md={6}>
                                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="h4" gutterBottom align="center">
                                            Add New Code
                                        </Typography>
                                        <Divider sx={{ mb: 2 }} />
                                        <Box
                                            component="form"
                                            onSubmit={handleSubmit}
                                            noValidate
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 2,
                                            }}
                                        >
                                            <TextField
                                                select
                                                fullWidth
                                                label="Code Type"
                                                value={codeType}
                                                onChange={(e) =>
                                                    setCodeType(e.target.value)
                                                }
                                                variant="outlined"
                                            >
                                                <MenuItem value="Barcode">
                                                    Barcode
                                                </MenuItem>
                                                <MenuItem value="QRCode">
                                                    QRCode
                                                </MenuItem>
                                            </TextField>
                                            <TextField
                                                fullWidth
                                                label="Code Value"
                                                value={codeValue}
                                                onChange={(e) => {
                                                    setCodeValue(e.target.value);
                                                    if (e.target.value.trim())
                                                        setCodeValueError(false);
                                                }}
                                                required
                                                error={codeValueError}
                                                helperText={
                                                    codeValueError
                                                        ? "Code Value is required"
                                                        : ""
                                                }
                                                variant="outlined"
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setIsScannerOpen(true)}
                                                            >
                                                                <QrCodeScannerIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<AddCircleIcon />}
                                                size="large"
                                            >
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
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems: "center",
                                                mb: 2,
                                            }}
                                        >
                                            <Typography variant="h4" gutterBottom align="center">
                                                Scanned Data
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={handleDownload}
                                                startIcon={<FileDownloadIcon />}
                                            >
                                                Export   



                                            </Button>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            {!isSearchVisible ? (
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<SearchIcon />}
                                                    onClick={() =>
                                                        setIsSearchVisible(true)
                                                    }
                                                >
                                                    Search
                                                </Button>
                                            ) : (
                                                <TextField
                                                    placeholder="Search by Code Type or Value"
                                                    value={searchQuery}
                                                    onChange={(e) =>
                                                        setSearchQuery(
                                                            e.target.value
                                                        )
                                                    }
                                                    onBlur={() =>
                                                        setIsSearchVisible(false)
                                                    }
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: "#f9f9f9",
                                                        borderRadius: 1,
                                                    }}
                                                />
                                            )}
                                        </Box>
                                        <TableContainer
                                            component={Paper}
                                            sx={{
                                                maxHeight: 400,
                                                boxShadow: 0,
                                                borderRadius: 2,
                                                overflowY: "auto",
                                            }}
                                        >
                                            <Table stickyHeader>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>ID</TableCell>
                                                        <TableCell>
                                                            Code Type
                                                        </TableCell>
                                                        <TableCell>
                                                            Code Value
                                                        </TableCell>
                                                        <TableCell>
                                                            Timestamp
                                                        </TableCell>
                                                        <TableCell align="center">
                                                            Actions
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {filteredData.map((data) => (
                                                        <TableRow key={data.id}>
                                                            <TableCell>
                                                                {data.id}
                                                            </TableCell>
                                                            <TableCell>
                                                                {data.codeType}
                                                            </TableCell>
                                                            <TableCell
                                                                sx={{
                                                                    wordBreak:
                                                                        "break-word",
                                                                }}
                                                            >
                                                                {data.codeValue}
                                                            </TableCell>
                                                            <TableCell>
                                                                {new Date(
                                                                    data.timestamp
                                                                ).toLocaleString()}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Button
                                                                    variant="outlined"
                                                                    color="error"
                                                                    startIcon={
                                                                        <DeleteIcon />
                                                                    }
                                                                    onClick={() => {
                                                                        setDeleteId(data.id); // Set the ID of the item to delete
                                                                        setIsDeleteDialogOpen(true); // Open the confirmation dialog
                                                                    }}
                                                                >
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
            <Dialog open={isScannerOpen} onClose={() => setIsScannerOpen(false)}>
                <DialogTitle>Scan QR Code</DialogTitle>
                <DialogContent>
                    <QrCodeScanner
                        onScan={(value) => {
                            setCodeValue(value);
                            setCodeType("QRCode");
                            setIsScannerOpen(false);
                        }}
                        onClose={() => setIsScannerOpen(false)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsScannerOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirmation}
            />
        </Box>
    );
};

export default App;
import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/browser';
import { Box, Card, CardContent, Typography, CircularProgress, Button, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import FlashlightOnIcon from '@mui/icons-material/FlashlightOn';
import FlashlightOffIcon from '@mui/icons-material/FlashlightOff';
import Feedback from './Feedback';
import ScanningAreaHighlight from './ScanningAreaHighlight';
import './App.css';

const QrCodeScanner = ({ onScan, onClose }) => {
    const videoRef = useRef(null);
    const codeReader = useRef(new BrowserMultiFormatReader());
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanType, setScanType] = useState('QR_CODE');
    const [flashlightOn, setFlashlightOn] = useState(false);
    const [scanHistory, setScanHistory] = useState([]);
    const [playSound, setPlaySound] = useState(true);
    const [vibrate, setVibrate] = useState(true);

    const supportedFormats = [
        'QR_CODE',
        'CODE_128',
        'CODE_39',
        'EAN_13',
        'UPC_A'
    ];

    const startScanning = async () => {
        setLoading(true);
        try {
            await codeReader.current.decodeFromVideoDevice(null, videoRef.current, async (result, error) => {
                if (result) {
                    const format = result.getBarcodeFormat();
                    setScanType(format);
                    const scannedText = result.getText();
                    onScan(scannedText);
                    setScanHistory(prevHistory => [...prevHistory, { format, text: scannedText }]);
                    stopScanning();
                    onClose();
                    handleFeedback();
                }
                if (error && !(error instanceof Error)) {
                    console.error(error);
                }
            }, { formats: supportedFormats.map(format => BarcodeFormat[format]) });

            // Enable auto-focus
            if (videoRef.current && videoRef.current.srcObject) {
                const track = videoRef.current.srcObject.getVideoTracks()[0];
                const capabilities = track.getCapabilities();
                if (capabilities.focusMode) {
                    await track.applyConstraints({
                        advanced: [{ focusMode: 'continuous' }]
                    });
                }
            }
        } catch (error) {
            console.error("Error starting the scanner:", error);
        } finally {
            setLoading(false);
            setIsScanning(true);
        }
    };

    const stopScanning = () => {
        if (codeReader.current && typeof codeReader.current.reset === 'function') {
            codeReader.current.reset();
        }
        setIsScanning(false);
    };

    const toggleFlashlight = async () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const track = videoRef.current.srcObject.getVideoTracks()[0];
            const capabilities = track.getCapabilities();
            if (capabilities.torch) {
                const settings = track.getSettings();
                await track.applyConstraints({
                    advanced: [{ torch: !settings.torch }]
                });
                setFlashlightOn(!settings.torch);
            }
        } else {
            console.error("Video source or tracks are not available.");
        }
    };

    const handleFeedback = () => {
        if (playSound) {
            const audio = new Audio('/path/to/sound.mp3'); // Replace with the path to your sound file
            audio.play();
        }
        if (vibrate) {
            navigator.vibrate(200); // Vibrate for 200ms
        }
    };

    useEffect(() => {
        return () => {
            stopScanning();
        };
    }, []);

    return (
        <Card className="card">
            <CardContent className="card-content">
                <Typography variant="h5" gutterBottom>
                    Code Scanner
                </Typography>
                <FormControl className="form-control">
                    <InputLabel id="scan-type-label">Scan Type</InputLabel>
                    <Select
                        labelId="scan-type-label"
                        value={scanType}
                        label="Scan Type"
                        onChange={(e) => setScanType(e.target.value)}
                        className="select"
                    >
                        <MenuItem value="QR_CODE">QR Code</MenuItem>
                        <MenuItem value="CODE_128">Barcode (Code 128)</MenuItem>
                        <MenuItem value="CODE_39">Barcode (Code 39)</MenuItem>
                        <MenuItem value="EAN_13">Barcode (EAN-13)</MenuItem>
                        <MenuItem value="UPC_A">Barcode (UPC-A)</MenuItem>
                    </Select>
                </FormControl>
                <Box className="box">
                    {loading ? (
                        <CircularProgress className="circular-progress" />
                    ) : (
                        <>
                            {!isScanning && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={startScanning}
                                    className="button button-primary"
                                    startIcon={<CameraAltIcon />}
                                >
                                    Start Scanning
                                </Button>
                            )}
                            {isScanning && (
                                <IconButton
                                    color="secondary"
                                    onClick={toggleFlashlight}
                                    className="flashlight-button"
                                >
                                    {flashlightOn ? <FlashlightOffIcon /> : <FlashlightOnIcon />}
                                </IconButton>
                            )}
                            <div className="video-container">
                                <video ref={videoRef} className={`video ${isScanning ? 'active' : ''}`} />
                                {isScanning && <ScanningAreaHighlight />}
                            </div>
                        </>
                    )}
                </Box>
                <Typography variant="h6" gutterBottom>
                    Scan History
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Format</TableCell>
                                <TableCell>Text</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scanHistory.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.format}</TableCell>
                                    <TableCell>{item.text}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Feedback playSound={playSound} vibrate={vibrate} />
            </CardContent>
        </Card>
    );
};

export default QrCodeScanner;

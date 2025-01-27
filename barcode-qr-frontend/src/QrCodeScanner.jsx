import React, { useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Box, Button } from '@mui/material';

const QrCodeScanner = ({ onScan, onClose }) => {
    const videoRef = useRef(null);
    const codeReader = useRef(new BrowserMultiFormatReader());

    useEffect(() => {
        const startScanning = async () => {
            try {
                await codeReader.current.decodeFromVideoDevice(null, videoRef.current, (result, error) => {
                    if (result) {
                        onScan(result.getText());
                        onClose(); 
                        if (codeReader.current && typeof codeReader.current.reset === 'function') {
                            codeReader.current.reset();
                        }
                    }
                    if (error && !(error instanceof Error)) {
                        console.error(error);
                    }
                });
            } catch (error) {
                console.error("Error starting the scanner:", error);
            }
        };

        startScanning();

        return () => {
            if (codeReader.current && typeof codeReader.current.reset === 'function') {
                codeReader.current.reset();
            } else {
                console.error('codeReader.current is not initialized or does not have a reset function');
            }
        };
    }, [onScan, onClose]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <video ref={videoRef} style={{ width: '100%' }} />
            <Button variant="contained" color="primary" onClick={onClose} sx={{ mt: 2 }}>
                Close Scanner
            </Button>
        </Box>
    );
};

export default QrCodeScanner;

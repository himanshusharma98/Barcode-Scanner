import React from 'react';
import { Box, CircularProgress, Typography, LinearProgress, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ScannerIcon from '@mui/icons-material/Scanner';

const ScanningStatusIndicator = ({ loading, isScanning }) => {
    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: 'center', maxWidth: 400, margin: 'auto' }}>
            {loading && (
                <>
                    <CircularProgress color="primary" />
                    <Typography variant="h6" mt={2} color="textSecondary">
                        Initializing Scanner...
                    </Typography>
                    <LinearProgress color="primary" sx={{ width: '100%', mt: 2 }} />
                </>
            )}
            {isScanning && !loading && (
                <>
                    <ScannerIcon color="primary" sx={{ fontSize: 50 }} />
                    <Typography variant="h6" mt={2} color="textSecondary">
                        Scanning in Progress...
                    </Typography>
                </>
            )}
            {!isScanning && !loading && (
                <>
                    <CheckCircleIcon color="primary" sx={{ fontSize: 50 }} />
                    <Typography variant="h6" mt={2} color="textSecondary">
                        Scanner is Ready
                    </Typography>
                </>
            )}
        </Paper>
    );
};

export default ScanningStatusIndicator;


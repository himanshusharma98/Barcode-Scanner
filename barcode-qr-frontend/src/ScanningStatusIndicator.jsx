import React from 'react';
import { Box, CircularProgress, Typography, LinearProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ScannerIcon from '@mui/icons-material/Scanner';

const ScanningStatusIndicator = ({ loading, isScanning }) => {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={2} p={2} borderRadius={2} boxShadow={3} bgcolor="background.paper">
            {loading && (
                <>
                    <CircularProgress color="primary" />
                    <Typography variant="body1" mt={2} color="textSecondary">
                        Initializing Scanner...
                    </Typography>
                    <LinearProgress color="primary" style={{ width: '100%', marginTop: '8px' }} />
                </>
            )}
            {isScanning && !loading && (
                <>
                    <ScannerIcon color="primary" style={{ fontSize: 40 }} />
                    <Typography variant="body1" mt={2} color="textSecondary">
                        Scanning in Progress...
                    </Typography>
                </>
            )}
            {!isScanning && !loading && (
                <>
                    <CheckCircleIcon color="primary" style={{ fontSize: 40 }} />
                    <Typography variant="body1" mt={2} color="textSecondary">
                        Scanner is Ready
                    </Typography>
                </>
            )}
        </Box>
    );
};

export default ScanningStatusIndicator;


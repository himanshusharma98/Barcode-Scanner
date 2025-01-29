import React from 'react';
import { IconButton } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const Feedback = ({ playSound, vibrate }) => {
    const handleFeedback = () => {
        if (playSound) {
            const audio = new Audio('./src/assets/scan_success.mp3'); // Replace with the path to your sound file
            audio.play();
        }
        if (vibrate) {
            navigator.vibrate(200); // Vibrate for 200ms
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem' }}>
            <IconButton color="primary" onClick={handleFeedback}>
                <VolumeUpIcon />
            </IconButton>
        </div>
    );
};

export default Feedback;

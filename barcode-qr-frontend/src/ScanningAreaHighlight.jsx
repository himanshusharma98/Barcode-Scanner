import React from 'react';
import './ScanningAreaHighlight.css';

const ScanningAreaHighlight = () => {
    return (
        <div className="scanning-area-highlight">
            <div className="highlight-border top"></div>
            <div className="highlight-border right"></div>
            <div className="highlight-border bottom"></div>
            <div className="highlight-border left"></div>
        </div>
    );
};

export default ScanningAreaHighlight;
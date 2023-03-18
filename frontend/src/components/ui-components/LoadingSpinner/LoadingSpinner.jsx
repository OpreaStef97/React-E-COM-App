import React from 'react';

import './LoadingSpinner.scss';

const LoadingSpinner = props => {
    return (
        <div className={`${props.asOverlay && 'loading-spinner__overlay'} ${props.className}`}>
            <div className="lds-dual-ring"></div>
        </div>
    );
};

export default LoadingSpinner;

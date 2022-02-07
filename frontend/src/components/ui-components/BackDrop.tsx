import React from 'react';
import ReactDOM from 'react-dom';

import './BackDrop.scss';

const BackDrop = (props: any) => {
    return ReactDOM.createPortal(
        <div className="backdrop" onClick={props.onClick}></div>,
        document.getElementById('backdrop-overlay')!
    );
};

export default BackDrop;

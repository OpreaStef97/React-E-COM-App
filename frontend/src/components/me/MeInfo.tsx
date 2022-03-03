import React, { FC } from 'react';
import './MeInfo.scss';
import MeInfoNameForm from './MeInfoNameForm';
import MeInfoPassForm from './MeInfoPassForm';

const MeInfo: FC = props => {
    return (
        <div className={`me-info`}>
            <h2 className="me-info__title">Your account</h2>
            <div className="me-info__container">
                <MeInfoNameForm />
                <MeInfoPassForm />
            </div>
        </div>
    );
};
export default MeInfo;

import { FC } from 'react';
import './MainHeader.scss';

const MainHeader: FC<{ className?: string; style?: { [key: string]: string } }> = props => {
    return (
        <header className={`main-header ${props.className}`} style={{ ...props.style }}>
            {props.children}
        </header>
    );
};

export default MainHeader;

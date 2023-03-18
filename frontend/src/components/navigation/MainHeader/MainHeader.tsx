import { FC, ReactNode } from 'react';
import './MainHeader.scss';

const MainHeader: FC<{
    children: ReactNode; className?: string; style?: { [key: string]: string } 
}> = props => {
    return (
        <header className={`main-header ${props.className}`} style={{ ...props.style }}>
            {props.children}
        </header>
    );
};

export default MainHeader;

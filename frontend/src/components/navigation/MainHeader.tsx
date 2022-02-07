import { FC } from 'react';
import './MainHeader.scss';

const MainHeader: FC<{ className?: string }> = props => {
    return <header className={`main-header ${props.className}`}>{props.children}</header>;
};

export default MainHeader;

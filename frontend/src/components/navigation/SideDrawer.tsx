import ReactDOM from 'react-dom';
import React, { FC } from 'react';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.scss';

const SideDrawer: FC<{ show: boolean; onClick?: (event: React.MouseEvent) => void }> = props => {
    const content = (
        <CSSTransition
            in={props.show}
            timeout={200}
            classNames="slide-in-left"
            mountOnEnter
            unmountOnExit
        >
            <aside onClick={props.onClick} className="side-drawer">
                {props.children}
            </aside>
        </CSSTransition>
    );

    return ReactDOM.createPortal(content, document.getElementById('drawer-hook')!);
};

export default SideDrawer;

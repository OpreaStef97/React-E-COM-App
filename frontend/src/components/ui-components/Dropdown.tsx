import React from 'react';
import { FC, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import './Dropdown.scss';

const Dropdown: FC<{
    idx?: number;
    show?: boolean;
    allFalse?: boolean;
    height?: string;
    className?: string;
    links?: { name?: string; to?: string }[];
    transitionMs?: number;
    delayMs?: number;
    animationMs?: number;
    style?: { [key: string]: string };
    children?: React.ReactNode;
}> = props => {
    const [transition, setTransition] = useState(false);
    const [change, setChange] = useState(false);

    useEffect(() => {
        setTransition(!!props.show);
    }, [props.show]);

    return (
        <CSSTransition
            in={transition}
            timeout={props.allFalse ? 0 : props.delayMs || 700}
            mountOnEnter
            unmountOnExit
            onEntered={() => setChange(true)}
            onExit={() => setChange(false)}
        >
            <>
                <div
                    className={`dropdown__container ${change ? 'dropdown__container-active' : ''} ${
                        props.className
                    }`}
                    style={{
                        ...props.style,
                        transition: `all ${
                            props.transitionMs || 300
                        }ms ${'cubic-bezier(0.75, 0, 0.25, 1)'}`,
                        height: `${change ? props.height || '50vh' : '0'}`,
                    }}
                >
                    <div className="dropdown__container-item">{props.children}</div>
                </div>
            </>
        </CSSTransition>
    );
};

export default Dropdown;

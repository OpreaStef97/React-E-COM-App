import React from 'react';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import './Dropdown.scss';

const Dropdown: FC<{
    idx?: number;
    show?: boolean;
    allFalse?: boolean;
    links?: { name?: string; to?: string }[];
    onHover?: (idx: number) => void;
    style?: {};
    children?: React.ReactNode;
}> = props => {
    const [transition, setTransition] = useState(false);
    const [change, setChange] = useState(false);

    const { onHover } = props;

    useEffect(() => {
        setTransition(!!props.show);
    }, [props.show]);

    // Non Overlapping Dropdown
    return (
        <div className={`dropdown`}>
            <CSSTransition
                in={transition}
                timeout={props.allFalse ? 0 : 700}
                unmountOnExit
                onEntered={() => setChange(true)}
                onExit={() => setChange(false)}
            >
                <>
                    <div
                        className={`dropdown__container ${
                            change ? 'dropdown__container-active' : ''
                        }`}
                    >
                        {props.links && props.links.length > 0 && (
                            <ul className="dropdown__container-links" style={props.style}>
                                {props.links.map((link, i) => {
                                    return (
                                        <li className="dropdown__container-links--item" key={i}>
                                            <Link
                                                className="dropdown__container-link"
                                                to={link.to || '/'}
                                                onMouseEnter={onHover?.bind(null, i)}
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                        <div className="dropdown__container-item">{props.children}</div>
                    </div>
                </>
            </CSSTransition>
        </div>
    );
};

export default Dropdown;

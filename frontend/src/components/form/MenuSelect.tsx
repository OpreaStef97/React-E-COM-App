import { CaretDown, XCircle } from 'phosphor-react';
import React from 'react';
import { FC, useEffect, useRef, useState } from 'react';
import useClickOutside from '../../hooks/use-clicks-outside';
import './MenuSelect.scss';

const MenuSelect: FC<{
    id: string;
    options: {
        options: string[];
        selected: boolean[];
    };
    label?: string;
    placeholder?: string;
    className?: string;
    uniqueSelect?: boolean;
    onlySelect?: boolean;
    errorText?: string;
    error?: boolean;
    onSelect?: (...args: any[]) => void;
    onDelete?: (id?: string) => void;
    onTouch?: () => void;
}> = props => {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { clicked, clearClick } = useClickOutside(ref);
    const { options, onSelect, onDelete, id, uniqueSelect } = props;

    const showHandler = () => {
        setShow(prev => !prev);
    };

    useEffect(() => {
        if (clicked) {
            setShow(false);
        }
        clearClick();
    }, [clicked, clearClick]);

    const placeholder =
        options.options
            .filter((_, idx: number) => options.selected[idx] === true)
            .toString()
            .split(',')
            .join(', ') ||
        props.placeholder ||
        'Select Item';

    return (
        <div className="menu-select-wrapper">
            {props.label && <span className="menu-select-label">{props.label}</span>}
            <div
                className={`menu-select ${show ? 'active' : ''} ${props.className}`}
                tabIndex={0}
                onBlur={props.onTouch}
                ref={ref}
            >
                <div className={`menu-select__select ${props.error ? 'error' : ''}`}>
                    <div onClick={showHandler} className="menu-select__select-placeholder">
                        <p>{props.error ? props.errorText : placeholder}</p>
                    </div>
                    {!props.onlySelect && (
                        <button
                            onClick={onDelete && onDelete.bind(null, id)}
                            style={{
                                display: `${
                                    placeholder === 'Select Item' ||
                                    placeholder === props.placeholder
                                        ? 'none'
                                        : 'flex'
                                }`,
                            }}
                            className="menu-select__select-close"
                            aria-label="close-select"
                        >
                            <XCircle className="menu-select__select-close-icon" />
                        </button>
                    )}
                    <button
                        onClick={showHandler}
                        aria-label="open-select"
                        className="menu-select__select-open"
                    >
                        <CaretDown className="menu-select__select-icon" />
                    </button>
                </div>
                <div className="menu-select__dropdown">
                    <ul className="menu-select__dropdown-list">
                        {options &&
                            options.options.map((item: any, idx: number) => {
                                return (
                                    <li
                                        onClick={() => {
                                            showHandler();
                                            if (onSelect)
                                                onSelect(
                                                    id,
                                                    item,
                                                    uniqueSelect,
                                                    !!props.onlySelect
                                                );
                                        }}
                                        className={`menu-select__dropdown-list--item ${
                                            options.selected[idx] && 'active'
                                        }`}
                                        key={idx}
                                    >
                                        <span>{item}</span>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default React.memo(MenuSelect);

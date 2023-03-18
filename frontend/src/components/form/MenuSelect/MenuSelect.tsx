import { CaretDown, XCircle } from "phosphor-react";
import React, { useCallback } from "react";
import { FC, useEffect, useRef, useState } from "react";
import { useClickOutside } from "../../../hooks";
import "./MenuSelect.scss";

const MenuSelect: FC<{
    id: string;
    options: {
        options: string[];
        selected: boolean[];
    };
    label?: string;
    placeholder?: string;
    className?: string;
    show?: boolean;
    uniqueSelect?: boolean;
    onlySelect?: boolean;
    errorText?: string;
    error?: boolean;
    onSelect?: (...args: any[]) => void;
    onDelete?: (id?: string) => void;
    onTouch?: () => void;
    onClick?: React.Dispatch<React.SetStateAction<boolean>>;
}> = React.memo((props) => {
    const [show, setShow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { clicked, clearClick } = useClickOutside(ref);
    const { options, onSelect, onDelete, id, uniqueSelect, onClick } = props;

    function showHandler(e: React.MouseEvent | undefined) {
        e?.preventDefault();
        setShow((prev) => !prev);
    }

    function deleteHandler(this: React.MouseEvent | undefined, id?: string) {
        this?.preventDefault();
        onDelete?.(id);
        setShow(false);
    }

    useEffect(() => {
        onClick?.(show);
    }, [onClick, show]);

    useEffect(() => {
        if (props.show) {
            setShow(false);
        }
    }, [props.show]);

    useEffect(() => {
        if (clicked) {
            setShow(false);
            onClick?.(false);
        }
        clearClick();
    }, [clicked, clearClick, onClick]);

    const placeholder = useCallback(() => {
        return (
            options?.options
                .filter((_, idx: number) => options.selected[idx])
                .toString()
                .split(",")
                .join(", ") ||
            props.placeholder ||
            "Select Item"
        );
    }, [options, props.placeholder])();

    return (
        <div className="menu-select-wrapper">
            {props.label && <span className="menu-select-label">{props.label}</span>}
            <div
                className={`menu-select ${show ? "active" : ""} ${props.className}`}
                tabIndex={0}
                onBlur={props.onTouch}
                ref={ref}
            >
                <div
                    className={`menu-select__select ${props.error ? "error" : ""}`}
                    style={
                        props.onlySelect ||
                        placeholder === "Select Item" ||
                        placeholder === props.placeholder
                            ? {}
                            : { backgroundColor: "#e3fdf4", color: "#043223", fontWeight: 500 }
                    }
                >
                    {!props.onlySelect && (
                        <button
                            onClick={deleteHandler.bind(this, id)}
                            style={{
                                display: `${
                                    placeholder === "Select Item" ||
                                    placeholder === props.placeholder
                                        ? "none"
                                        : "flex"
                                }`,
                            }}
                            className="menu-select__select-close"
                            aria-label="close-select"
                            type="button"
                        >
                            <XCircle className="menu-select__select-close-icon" />
                        </button>
                    )}
                    <div onClick={showHandler} className="menu-select__select-placeholder">
                        <p>{props.error ? props.errorText : placeholder}</p>
                    </div>
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
                        {options?.options.map((item: any, idx: number) => {
                            return (
                                <li
                                    onClick={(e) => {
                                        showHandler(e);
                                        onSelect?.(id, item, uniqueSelect, !!props.onlySelect);
                                    }}
                                    className={`menu-select__dropdown-list--item ${
                                        options.selected[idx] && "active"
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
});

export default MenuSelect;

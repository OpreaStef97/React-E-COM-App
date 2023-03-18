import { CircleNotch } from "phosphor-react";
import { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import "./Button.scss";

const Button: FC<{
    children: ReactNode;
    id?: string;
    link?: boolean;
    disabled?: boolean;
    loading?: boolean;
    to?: string;
    state?: { [k: string]: string };
    className?: string;
    inverse?: boolean;
    light?: boolean;
    active?: boolean;
    role?: string;
    icon?: JSX.Element;
    iconAfter?: boolean;
    style?: { [key: string]: string };
    onClick?: (...args: any[]) => void;
}> = (props) => {
    if (props.to && props.link && props.disabled) {
        console.warn("Only buttons can be disabled");
    }

    return (
        <>
            {!props.link && (
                <button
                    id={props.id}
                    role={props.role}
                    className={`${
                        props.light
                            ? `btn-light ${props.light && props.active ? "btn-light-active" : ""}`
                            : `btn ${props.inverse ? "btn-inverse" : ""}`
                    } ${props.disabled ? "disabled" : ""} ${props.className}`}
                    onClick={props.onClick}
                    style={props.style}
                    disabled={props.disabled}
                >
                    {!props.loading ? (
                        <>
                            {!props.iconAfter && props.icon}
                            <span>{props.children}</span>
                            {props.iconAfter && props.icon}
                        </>
                    ) : (
                        <CircleNotch className="btn-load" />
                    )}
                </button>
            )}
            {props.link && props.to && (
                <Link
                    state={props.state}
                    id={props.id}
                    to={props.to}
                    className={`${
                        props.light
                            ? `link-light ${props.active ? "link-light-active" : ""}`
                            : `link ${props.inverse ? "link-inverse" : ""}`
                    } ${props.className}`}
                    onClick={props.onClick}
                    style={props.style}
                >
                    {!props.iconAfter && props.icon}
                    <span>{props.children}</span>
                    {props.iconAfter && props.icon}
                </Link>
            )}
        </>
    );
};

export default Button;

import { FC } from 'react';
import { Link } from 'react-router-dom';
import './Button.scss';

const Button: FC<{
    link?: boolean;
    to?: string;
    className?: string;
    inverse?: boolean;
    light?: boolean;
    active?: boolean;
    role?: string;
    style?: { [key: string]: string };
    onClick?: (...args: any[]) => void;
}> = props => {
    return (
        <>
            {!props.link && (
                <button
                    role={props.role}
                    className={`${
                        props.light
                            ? `btn-light ${
                                  props.light && props.active
                                      ? 'btn-light-active'
                                      : ''
                              }`
                            : `btn ${props.inverse ? 'btn-inverse' : ''}`
                    } ${props.className}`}
                    onClick={props.onClick}
                    style={props.style}
                >
                    <span>{props.children}</span>
                </button>
            )}
            {props.link && props.to && (
                <Link
                    to={props.to}
                    className={`${
                        props.light
                            ? `link-light ${
                                  props.active ? 'link-light-active' : ''
                              }`
                            : `link ${props.inverse ? 'link-inverse' : ''}`
                    } ${props.className}`}
                    onClick={props.onClick}
                    style={props.style}
                >
                    <span>{props.children}</span>
                </Link>
            )}
        </>
    );
};

export default Button;

import { FC, ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { useImageLoad, useWindow } from "../../../hooks";
import { Dropdown } from "../../ui-components";
import "./Avatar.scss";

const Avatar: FC<{
    children: ReactNode;
    drawer?: boolean;
    photo?: string;
    name?: string;
    style?: { [key: string]: string };
    onClick?: () => void;
}> = (props) => {
    const loadedSrc = useImageLoad(props.photo || "");
    const [showDropdown, setShowDropdown] = useState(false);
    const [width] = useWindow();

    return (
        <div
            className="avatar"
            onMouseLeave={() => setShowDropdown(false)}
            onMouseEnter={() => setShowDropdown(true)}
        >
            <Link
                to="/me"
                className="avatar-main-link"
                style={{ ...props.style }}
                onClick={() => {
                    setShowDropdown((prev) => !prev);
                    props.onClick?.();
                }}
            >
                <span>{props.name?.toUpperCase()}</span>
                {loadedSrc && <img src={loadedSrc} alt={props.name} />}
            </Link>
            <div style={{ position: "absolute", height: "0.5rem", width: "100%" }}></div>
            <Dropdown
                allFalse={showDropdown}
                show={width > 1100 && showDropdown}
                className="avatar-dropdown__component"
                height="25rem"
                transitionMs={450}
            >
                <div className="avatar-dropdown">
                    <p className="avatar-text">Hi, {props.name?.split(" ")[0]}!</p>
                    <div className="separator" style={{ backgroundColor: "#0b6775" }}></div>
                    <>
                        <Link
                            to="/me"
                            className="avatar-link"
                            onClick={() => setShowDropdown((prev) => !prev)}
                        >
                            Your Account
                        </Link>
                        <Link
                            to="/me/reviews"
                            className="avatar-link"
                            onClick={() => setShowDropdown((prev) => !prev)}
                        >
                            Your Reviews
                        </Link>
                        <Link
                            to="/me/purchases"
                            className="avatar-link"
                            onClick={() => setShowDropdown((prev) => !prev)}
                        >
                            Your Purchases
                        </Link>
                    </>
                    {props.children}
                </div>
            </Dropdown>
        </div>
    );
};

export default Avatar;

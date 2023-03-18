import { SignIn } from "phosphor-react";
import { FC } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useWindow } from "../../../hooks";
import { AuthType } from "../../../store/auth";
import { CartDropdown, Favorites } from "../../cart";
import { LogoutButton } from "../../ui-components";
import Avatar from "../Avatar";
import "./NavLinks.scss";

const NavLinks: FC<{ onClick?: () => void; drawer?: boolean }> = (props) => {
    const { auth } = useSelector((state: { auth: AuthType }) => state);
    const [width] = useWindow();

    const { isLoggedIn, user } = auth;
    return (
        <ul className="nav-links__list">
            <li className="nav-links__list-item">
                {isLoggedIn && (
                    <Avatar
                        drawer={props.drawer}
                        name={user?.name.split(" ")[0]}
                        photo={`${process.env.REACT_APP_RESOURCES_URL}/users/${user?.photo}`}
                        onClick={props.onClick}
                    >
                        <LogoutButton onClick={props.onClick} />
                    </Avatar>
                )}
                {!isLoggedIn && (
                    <Link
                        className="nav-links__list-link"
                        to="/auth"
                        aria-label="nav-links-login"
                        onClick={props.onClick}
                    >
                        <span>LOGIN</span>
                        <SignIn />
                    </Link>
                )}
            </li>
            <li className="nav-links__list-item">
                <Favorites onClick={props.onClick} />
            </li>
            {!props.drawer && (
                <li className="nav-links__list-item">
                    <CartDropdown />
                </li>
            )}
            {width > 840 && width <= 1100 && isLoggedIn && (
                <li>
                    <LogoutButton />
                </li>
            )}
        </ul>
    );
};

export default NavLinks;

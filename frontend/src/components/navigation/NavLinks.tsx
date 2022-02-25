import { SignIn, Heart } from 'phosphor-react';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CartButton from '../ui-components/CartButton';
import LogoutButton from '../ui-components/LogoutButton';
import Avatar from './Avatar';
import './NavLinks.scss';

const NavLinks: FC<{ onClick?: () => void; drawer?: boolean }> = props => {
    const { auth } = useSelector((state: any) => state);

    const { isLoggedIn, user } = auth;
    return (
        <ul className="nav-links__list">
            <li className="nav-links__list-item">
                {isLoggedIn && (
                    <Avatar
                        drawer={props.drawer}
                        name={user.name.split(' ')[0]}
                        photo={`${process.env.REACT_APP_RESOURCES_URL}/images/users/${user.photo}`}
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
                <Link
                    className="nav-links__list-link"
                    to="/"
                    aria-label="nav-links-favorites"
                    onClick={props.onClick}
                >
                    <span>FAVORITES</span>
                    <Heart />
                </Link>
            </li>
            {!props.drawer && (
                <li className="nav-links__list-item">
                    <CartButton />
                </li>
            )}
        </ul>
    );
};

export default NavLinks;

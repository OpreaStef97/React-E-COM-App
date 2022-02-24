import { SignIn, Heart, ShoppingCart } from 'phosphor-react';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth-actions';
import sleep from '../../utils/sleep';
import Button from '../ui-components/Button';
import Avatar from './Avatar';
import './NavLinks.scss';

const NavLinks: FC<{ onClick?: () => void }> = props => {
    const { auth, cart } = useSelector((state: any) => state);

    const { isLoggedIn, user } = auth;
    const { totalQuantity } = cart;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        dispatch(logout());
        props.onClick && props.onClick();
        await sleep(500);
        navigate('/auth');
    };

    return (
        <ul className="nav-links__list">
            <li className="nav-links__list-item">
                {isLoggedIn && (
                    <Avatar
                        name={user.name.split(' ')[0]}
                        photo={`${process.env.REACT_APP_RESOURCES_URL}/images/users/${user.photo}`}
                    >
                        <Button onClick={logoutHandler} style={{ transform: 'scale(0.9)' }}>
                            LOGOUT
                        </Button>
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
            <li className="nav-links__list-item nav-links__list-item--cart">
                <Link
                    className="nav-links__list-link nav-links__list-cart"
                    to="/cart"
                    aria-label="nav-links-cart"
                    onClick={props.onClick}
                >
                    <span>CART</span>
                    <ShoppingCart />
                    {totalQuantity > 0 && (
                        <span key={totalQuantity} className="cart-counter">
                            {totalQuantity}
                        </span>
                    )}
                </Link>
            </li>
        </ul>
    );
};

export default NavLinks;

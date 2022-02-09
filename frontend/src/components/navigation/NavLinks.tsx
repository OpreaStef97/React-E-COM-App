import { SignIn, Heart, ShoppingCart } from 'phosphor-react';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../../hooks/use-fetch';
import { logout } from '../../store/auth-actions';
import Avatar from '../ui-components/Avatar';
import Button from '../ui-components/Button';
import './NavLinks.scss';

const NavLinks: FC = props => {
    const { isLoggedIn, user } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();

    return (
        <ul className="nav-links__list">
            <li className="nav-links__list-item">
                {isLoggedIn && (
                    <>
                        {/* <Button inverse onClick={() => dispatch(logout())}>
                            LOGOUT
                        </Button> */}
                        <Avatar
                            name={user.name.split(' ')[0].toUpperCase()}
                            photo={`http://localhost:5000/images/users/${user.photo}`}
                        />
                    </>
                )}
                {!isLoggedIn && (
                    <Link to="/auth" aria-label="nav-links-login">
                        <span>LOGIN</span>
                        <SignIn />
                    </Link>
                )}
            </li>
            <li className="nav-links__list-item">
                <Link to="/" aria-label="nav-links-favorites">
                    <span>FAVORITES</span>
                    <Heart />
                </Link>
            </li>
            <li className="nav-links__list-item nav-links__list-item--cart">
                <Link to="/" aria-label="nav-links-cart">
                    <span>CART</span>
                    <ShoppingCart />
                </Link>
            </li>
        </ul>
    );
};

export default NavLinks;

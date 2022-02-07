import { SignIn, Heart, ShoppingCart } from 'phosphor-react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import './NavLinks.scss';

const NavLinks: FC = props => {
    return (
        <ul className="nav-links__list">
            <li className="nav-links__list-item">
                <Link to="/" aria-label="nav-links-login">
                    <span>LOGIN</span>
                    <SignIn />
                </Link>
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

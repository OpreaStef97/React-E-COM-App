import { Info, Heart, Article, ShoppingBag } from 'phosphor-react';
import { Link } from 'react-router-dom';
import './MeMenu.scss';

export default function MeMenu({ pathname }: { pathname: string }) {
    return (
        <menu className="me-menu">
            <ul className="me-menu-list">
                <li className={`me-menu-item ${pathname === '/me' && 'me-menu-item--active'}`}>
                    <Link className={`me-menu-item__link link--info`} to="/me">
                        <span>Info</span>
                        <Info />
                    </Link>
                </li>
                <li
                    className={`me-menu-item ${
                        pathname === '/me/favorites' && 'me-menu-item--active'
                    }`}
                >
                    <Link className={`me-menu-item__link link--favorites`} to="/me/favorites">
                        <span>Favorites</span>
                        <Heart />
                    </Link>
                </li>
                <li
                    className={`me-menu-item ${
                        pathname === '/me/reviews' && 'me-menu-item--active'
                    }`}
                >
                    <Link className={`me-menu-item__link link--reviews`} to="/me/reviews">
                        <span>Reviews</span>
                        <Article />
                    </Link>
                </li>
                <li
                    className={`me-menu-item ${
                        pathname === '/me/purchases' && 'me-menu-item--active'
                    }`}
                >
                    <Link className={`me-menu-item__link link--purchases`} to="/me/purchases">
                        <span>Purchases</span>
                        <ShoppingBag />
                    </Link>
                </li>
            </ul>
        </menu>
    );
}

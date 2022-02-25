import React, { RefObject, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './MainNavigation.scss';
import Search from './Search';
import Logo from '../ui-components/Logo';
import NavLinks from './NavLinks';
import MainHeader from './MainHeader';
import useWindow from '../../hooks/use-window';
import BackDrop from '../ui-components/BackDrop';
import SideDrawer from './SideDrawer';
import useIntersect from '../../hooks/use-intersect';
import LogoutButton from '../ui-components/LogoutButton';
import CartButton from '../ui-components/CartButton';

const MainNav = React.forwardRef((props, ref) => {
    const [sticky, setSticky] = useState(false);
    const [animation, setAnimation] = useState(true);
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const navigate = useNavigate();

    const [width] = useWindow();
    const intersecting = useIntersect(ref as RefObject<unknown>);

    useEffect(() => {
        if (ref && (ref as RefObject<HTMLDivElement>).current instanceof HTMLElement) {
            setAnimation(true);
            setSticky(!intersecting);
        } else {
            setSticky(true);
            setAnimation(false);
        }
    }, [intersecting, ref]);

    useEffect(() => {
        if (width >= 840 && drawerIsOpen) {
            setDrawerIsOpen(false);
        }
    }, [width, drawerIsOpen]);

    const showDrawerHandler = useCallback(() => {
        setDrawerIsOpen(prevState => !prevState);
    }, []);

    return (
        <>
            {drawerIsOpen && <BackDrop onClick={showDrawerHandler} />}

            <SideDrawer show={drawerIsOpen}>
                <nav className="main-navigation__drawer-nav">
                    <Search className="main-navigation__search-bar" />
                    <NavLinks drawer onClick={showDrawerHandler} />
                    <LogoutButton onClick={showDrawerHandler} />
                </nav>
            </SideDrawer>

            <button
                className={`main-navigation__menu-btn ${
                    drawerIsOpen && 'main-navigation__menu-btn--active'
                }`}
                onClick={showDrawerHandler}
                aria-label="nav-menu-button"
            >
                <span className="main-navigation__menu-btn-icon"></span>
            </button>

            <MainHeader
                className={`${sticky && 'sticky'}`}
                style={animation ? {} : { animation: 'none' }}
            >
                <div className="main-header__logo" onClick={() => navigate('/')}>
                    <Logo />
                </div>
                {width <= 840 && <CartButton className='main-navigation__cart-btn'/>}
                <nav className="main-navigation__header-nav">
                    <Search className="main-navigation__search-bar" />
                    <NavLinks />
                </nav>
            </MainHeader>
        </>
    );
});

export default MainNav;

import React, { RefObject, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './MainNavigation.scss';
import Search from './Search';
import Logo from '../ui-components/Logo';
import NavLinks from './NavLinks';
import MainHeader from './MainHeader';
import useWindowWidth from '../../hooks/use-window-width';
import BackDrop from '../ui-components/BackDrop';
import SideDrawer from './SideDrawer';
import useIntersect from '../../hooks/use-intersect';

const MainNav = React.forwardRef((props, ref) => {
    const [sticky, setSticky] = useState(false);
    const [animation, setAnimation] = useState(true);
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const navigate = useNavigate();

    const width = useWindowWidth(null, null);
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
                    <NavLinks onClick={showDrawerHandler} />
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
                <nav className="main-navigation__header-nav">
                    <Search className="main-navigation__search-bar" />
                    <NavLinks />
                </nav>
            </MainHeader>
        </>
    );
});

export default MainNav;

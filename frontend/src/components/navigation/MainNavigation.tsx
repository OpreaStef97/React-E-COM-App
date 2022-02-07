import React, { RefObject, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './MainNavigation.scss';
import Search from './Search';
import Logo from '../ui-components/Logo';
import NavLinks from './NavLinks';
import MainHeader from './MainHeader';
import useWindowWidth from '../../hooks/use-window-width';
import BackDrop from '../ui-components/BackDrop';
import SideDrawer from './SideDrawer';

const MainNav = React.forwardRef((props, ref) => {
    const [sticky, setSticky] = useState(false);
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const navigate = useNavigate();

    const width = useWindowWidth(null, null);

    useEffect(() => {
        let slideshowRef: RefObject<HTMLDivElement>;
        const obs = new IntersectionObserver(
            entries => {
                const ent = entries[0];

                if (ent.isIntersecting === false) {
                    setSticky(true);
                } else {
                    setSticky(false);
                }
            },
            {
                root: null,
                threshold: 0,
                rootMargin: '-80px',
            }
        );
        if (ref && (ref as RefObject<HTMLDivElement>).current instanceof HTMLElement) {
            slideshowRef = ref as RefObject<HTMLDivElement>;
            obs.observe(slideshowRef.current as Element);
        } else {
            setSticky(true);
        }
    }, [ref]);

    useEffect(() => {
        if (width >= 840 && drawerIsOpen) {
            setDrawerIsOpen(false);
        }
    }, [width, drawerIsOpen]);

    const showDrawerHandler = () => {
        setDrawerIsOpen(prevState => !prevState);
    };

    const closeDrawerHandler = (event: React.MouseEvent) => {
        if ((event.target as Element).className !== 'side-drawer slide-in-left-enter-done') {
            return;
        }
        setDrawerIsOpen(false);
    };

    return (
        <>
            {drawerIsOpen && <BackDrop onClick={showDrawerHandler} />}

            <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
                <nav className="main-navigation__drawer-nav">
                    <Search className="main-navigation__search-bar" />
                    <NavLinks />
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

            <MainHeader className={`${sticky && 'sticky'}`}>
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

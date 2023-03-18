import { FC, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uiActions, UIType } from "../../../store/ui/ui-slice";
import { AuthType } from "../../../store/auth";
import { useWindow } from "../../../hooks";
import { CartDropdown } from "../../cart";

import "./MainNavigation.scss";
import { BackDrop, LogoutButton, Logo, Notification } from "../../ui-components";
import MainHeader from "../MainHeader";
import NavLinks from "../NavLinks";
import Search from "../Search";
import SideDrawer from "../SideDrawer";

const MainNav: FC = () => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { ui, auth } = useSelector((state: { ui: UIType; auth: AuthType }) => state);

    const [width] = useWindow();

    useEffect(() => {
        if (width >= 840 && drawerIsOpen) {
            setDrawerIsOpen(false);
        }
    }, [width, drawerIsOpen]);

    const showDrawerHandler = useCallback(() => {
        setDrawerIsOpen((prevState) => !prevState);
    }, []);

    return (
        <>
            {drawerIsOpen && <BackDrop onClick={showDrawerHandler} />}

            <SideDrawer show={drawerIsOpen}>
                <nav className="main-navigation__drawer-nav">
                    <Search className="main-navigation__search-bar" />
                    <NavLinks drawer onClick={showDrawerHandler} />
                    {auth.isLoggedIn && <LogoutButton onClick={showDrawerHandler} />}
                </nav>
            </SideDrawer>

            <button
                className={`main-navigation__menu-btn ${
                    drawerIsOpen && "main-navigation__menu-btn--active"
                }`}
                onClick={showDrawerHandler}
                aria-label="nav-menu-button"
            >
                <span className="main-navigation__menu-btn-icon"></span>
            </button>

            <MainHeader
                className={`${ui.stickyNav.sticky && "sticky"}`}
                style={ui.stickyNav.animation ? {} : { animation: "none" }}
            >
                <div className="main-header__logo" onClick={() => navigate("/")}>
                    <Logo />
                </div>
                {width <= 840 && <CartDropdown className="main-navigation__cart-btn" />}
                <nav className="main-navigation__header-nav">
                    <Search className="main-navigation__search-bar" />
                    <NavLinks />
                </nav>
            </MainHeader>
            <Notification
                show={ui.notification.visible}
                className={`${ui.stickyNav.sticky && "sticky"}`}
                error={ui.notification.status === "error"}
                warn={ui.notification.status === "warn"}
                info={ui.notification.status === "info"}
                timeOnScreen={ui.notification.timeOnScreen}
                message={ui.notification?.message ?? ""}
                onCancel={() => dispatch(uiActions.toggle())}
            />
        </>
    );
};

export default MainNav;

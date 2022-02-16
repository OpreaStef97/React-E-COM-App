import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from './hooks/use-fetch';

import Notification from './components/ui-components/Notification';
import ErrorBoundary from './error/ErrorBoundary';
import Footer from './components/footer/Footer';
import MainNavigation from './components/navigation/MainNavigation';
import Home from './pages/home/Home';
import ScrollToTop from './components/ui-components/ScrollToTop';
import Products from './pages/products/Products';
import ProductPage from './pages/products/ProductPage';
import Auth from './pages/auth/Auth';
import MePage from './pages/me-page/MePage';
import { setCSRFToken } from './store/auth-actions';
import { authActions } from './store/auth-slice';
import sleep from './utils/sleep';

const App = () => {
    const { pathname } = useLocation();
    const [showNotification, setShowNotification] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const { csrfToken, user, isLoggedIn } = useSelector((state: any) => state.auth);
    const { isLoading, sendRequest } = useFetch();

    const location = useLocation();

    useEffect(() => {
        dispatch(setCSRFToken());
    }, [dispatch, sendRequest]);

    useEffect(() => {
        if (!csrfToken) {
            return;
        }
        sendRequest(
            `${process.env.REACT_APP_API_URL}/users/is-logged-in`,
            'POST',
            {
                'x-csrf-token': csrfToken,
            },
            null,
            'include'
        )
            .then(data => {
                dispatch(authActions.loggingIn(data.user));
            })
            .catch(err => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const mute = err;
            });
    }, [sendRequest, csrfToken, dispatch]);

    const onShowHandler = useCallback(async (state: boolean) => {
        await sleep(400);
        setShowNotification(state);
    }, []);

    return (
        <ErrorBoundary>
            <MainNavigation ref={pathname === '/' ? ref : undefined} />
            <Notification
                show={showNotification}
                message={`Welcome ${user && user?.name?.split(' ')[0]}!`}
                onCancel={() => setShowNotification(false)}
            />
            <ScrollToTop>
                <TransitionGroup component={null}>
                    <CSSTransition
                        key={location.pathname.startsWith('/me') ? '' : location.pathname}
                        timeout={400}
                        classNames="fade"
                    >
                        <main>
                            <Routes location={location}>
                                {isLoggedIn ? (
                                    <Route path="/me/*" element={<MePage />} />
                                ) : (
                                    <Route path="/auth" element={<Auth onShow={onShowHandler} />} />
                                )}
                                <Route path="/" element={<Home ref={ref} />} />
                                <Route path="/products" element={<Products category="All" />} />
                                <Route
                                    path="/products/phones"
                                    element={<Products category="Phone" />}
                                />
                                <Route
                                    path="/products/tablets"
                                    element={<Products category="Tablet" />}
                                />
                                <Route
                                    path="/products/laptops"
                                    element={<Products category="Laptop" />}
                                />
                                <Route path="/product/:slug/:id" element={<ProductPage />} />
                                <Route path="*" element={<Navigate to={'/'} />} />
                            </Routes>
                        </main>
                    </CSSTransition>
                </TransitionGroup>
            </ScrollToTop>
            <Footer isLoading={isLoading} />
        </ErrorBoundary>
    );
};

export default App;

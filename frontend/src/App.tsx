import React, { useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ErrorBoundary from './error/ErrorBoundary';
import Footer from './components/footer/Footer';
import MainNavigation from './components/navigation/MainNavigation';
import Home from './pages/home/Home';
import ScrollToTop from './components/ui-components/ScrollToTop';
import Products from './pages/products/Products';
import ProductPage from './pages/products/ProductPage';
import Auth from './pages/auth/Auth';
import { useDispatch, useSelector } from 'react-redux';
import { setCSRFToken } from './store/auth-actions';
import useFetch from './hooks/use-fetch';
import { authActions } from './store/auth-slice';

const App = () => {
    const { pathname } = useLocation();
    const ref = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const { csrfToken } = useSelector((state: any) => state.auth);
    const { sendRequest } = useFetch();

    useEffect(() => {
        dispatch(setCSRFToken());
    }, [dispatch, sendRequest]);

    useEffect(() => {
        if (!csrfToken) {
            return;
        }
        sendRequest(
            'http://localhost:5000/api/users/is-logged-in',
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
            .catch(console.error);
    }, [sendRequest, csrfToken, dispatch]);

    return (
        <>
            <MainNavigation ref={pathname === '/' ? ref : undefined} />
            <ErrorBoundary>
                <main>
                    <ScrollToTop>
                        <Routes>
                            <Route path="/" element={<Home ref={ref} />} />
                            <Route path="/auth" element={<Auth />} />
                            <Route path="/products" element={<Products />} />
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
                    </ScrollToTop>
                </main>
            </ErrorBoundary>
            <Footer />
        </>
    );
};

export default App;

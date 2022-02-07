import React, { Suspense, useRef } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import ErrorBoundary from './error/ErrorBoundary';
import Footer from './components/footer/Footer';
import MainNavigation from './components/navigation/MainNavigation';
import Home from './pages/home/Home';
import LoadingSpinner from './components/ui-components/LoadingSpinner';
import ScrollToTop from './components/ui-components/ScrollToTop';
import Products from './pages/products/Products';
import ProductPage from './pages/products/ProductPage';


const App = () => {
    const { pathname } = useLocation();
    const ref = useRef<HTMLDivElement>(null);

    return (
        <>
            <MainNavigation ref={pathname === '/' ? ref : undefined} />
            <ErrorBoundary>
                <main>
                    <Suspense
                        fallback={
                            <div className="center">
                                <LoadingSpinner asOverlay />
                            </div>
                        }
                    >
                        <ScrollToTop>
                            <Routes>
                                <Route path="/" element={<Home ref={ref} />} />
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
                    </Suspense>
                </main>
            </ErrorBoundary>
            <Footer />
        </>
    );
};

export default App;

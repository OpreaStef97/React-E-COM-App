import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../../components/products/ProductList';
import Promoting from '../../components/promoting/Promoting';
import Testimonials from '../../components/promoting/Testimonials';
import SectionTitle from '../../components/ui-components/SectionTitle';
import SlideShowMenu from '../../components/home/SlideShowMenu';
import './Home.scss';
import { useTitle } from '../../hooks/use-title';

const Home = React.forwardRef((props, ref) => {
    useTitle(`ReactCOM | Home`);
    return (
        <div className="home">
            <SlideShowMenu ref={ref} />
            <Promoting />
            <SectionTitle>See what others say about us</SectionTitle>
            <Testimonials />
            <SectionTitle>Choose what to buy next</SectionTitle>
            <section className="home__product-lists">
                <div>
                    <div className="home__product-link">
                        <Link to={'/products/phones'}>Phones</Link>
                    </div>
                    <ProductList category="Phone" />
                </div>
                <div>
                    <div className="home__product-link">
                        <Link to={'/products/laptops'}>Laptops</Link>
                    </div>
                    <ProductList category="Laptop" />
                </div>
                <div>
                    <div className="home__product-link">
                        <Link to={'/products/tablets'}>Tablets</Link>
                    </div>
                    <ProductList category="Tablet" />
                </div>
            </section>
        </div>
    );
});

export default Home;

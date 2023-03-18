import { DeviceMobile, Laptop, DeviceTablet } from "phosphor-react";
import React, { FC } from "react";
import { Link } from "react-router-dom";
import { SlideShowMenu } from "../../../components/home";
import ProductList from "../../../components/products/ProductList";
import Promoting from "../../../components/promoting/Promoting";
import Testimonials from "../../../components/promoting/Testimonials";
import { SectionTitle } from "../../../components/ui-components";
import { useTitle } from "../../../hooks";

import "./HomePage.scss";

const HomePage: FC = (props) => {
    useTitle(`ReactECOM | Home`);
    return (
        <div className="home">
            <SlideShowMenu />
            <SectionTitle>Choose what to buy next</SectionTitle>
            <section className="home__product-lists">
                <div>
                    <div className="home__product-link">
                        <Link to={"/products/phones"}>
                            <DeviceMobile />
                            Phones
                        </Link>
                    </div>
                    <ProductList category="Phone" />
                </div>
                <div>
                    <div className="home__product-link">
                        <Link to={"/products/laptops"}>
                            <Laptop />
                            Laptops
                        </Link>
                    </div>
                    <ProductList category="Laptop" />
                </div>
                <div>
                    <div className="home__product-link">
                        <Link to={"/products/tablets"}>
                            <DeviceTablet />
                            Tablets
                        </Link>
                    </div>
                    <ProductList category="Tablet" />
                </div>
            </section>
            <SectionTitle>See what others say about us</SectionTitle>
            <Testimonials />
            <Promoting />
        </div>
    );
};

export default HomePage;

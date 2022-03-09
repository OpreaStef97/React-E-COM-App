import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../ui-components/Button';
import Offer from '../promoting/Offer';
import './ProductsSideBar.scss';
import useWindow from '../../hooks/use-window';
import TransitionSlider from '../ui-components/TransitionSlider';
import { DeviceMobile, DeviceTablet, Laptop, ShoppingBag } from 'phosphor-react';

const ProductsSideBar = (props: { className?: string }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [width] = useWindow();

    return (
        <div className={`products__side-bar ${props.className}`}>
            <h2 className="products__side-bar__title">Product Categories</h2>
            <ul className="products__side-bar__list">
                <li className="products__side-bar__list--item">
                    <Button
                        to={'/products/laptops'}
                        light
                        link
                        active={pathname === '/products/laptops' ? true : false}
                        icon={<Laptop />}
                    >
                        Laptops
                    </Button>
                </li>
                <li className="products__side-bar__list--item">
                    <Button
                        to={'/products/phones'}
                        light
                        link
                        active={pathname === '/products/phones' ? true : false}
                        icon={<DeviceMobile />}
                    >
                        Phones
                    </Button>
                </li>
                <li className="products__side-bar__list--item">
                    <Button
                        to={'/products/tablets'}
                        light
                        link
                        active={pathname === '/products/tablets' ? true : false}
                        icon={<DeviceTablet />}
                    >
                        Tablets
                    </Button>
                </li>
                <li className="products__side-bar__list--item">
                    <Button to={'/products'} light link icon={<ShoppingBag />}>
                        Others...
                    </Button>
                </li>
            </ul>
            <div className="separator"></div>
            {width > 1100 && (
                <>
                    <Offer
                        onClick={() =>
                            navigate(
                                `/product/samsung-galaxy-s21-ultra-5g-12gb-ram/620a659fb40c21b6c1ec071a`
                            )
                        }
                        style={{ width: '40rem' }}
                        src={'../../images/S21-Ultra-promo-image.jpeg'}
                        content={'S21 Ultra for just:'}
                        price={899}
                        light
                    />
                    <div className="separator"></div>
                    <Offer
                        onClick={() =>
                            navigate(
                                `/product/iphone-13-pro-max-5g-6gb-ram/620a659fb40c21b6c1ec0721`
                            )
                        }
                        style={{ width: '40rem' }}
                        src={'../../images/iphone13Pro-promo-image.jpeg'}
                        content={'iPhone 13 Pro for just:'}
                        price={1099}
                    />
                </>
            )}
            {width <= 1100 && (
                <TransitionSlider className="bg-color-1" transitionMs={150}>
                    <Offer
                        onClick={() =>
                            navigate(
                                `/product/samsung-galaxy-s21-ultra-5g-12gb-ram/620a659fb40c21b6c1ec071a`
                            )
                        }
                        style={{ width: '60rem' }}
                        src={'../../images/S21-Ultra-promo-image.jpeg'}
                        content={'S21 Ultra for just:'}
                        price={899}
                        light
                    />
                    <Offer
                        onClick={() =>
                            navigate(
                                `/product/iphone-13-pro-max-5g-6gb-ram/620a659fb40c21b6c1ec0721`
                            )
                        }
                        style={{ width: '60rem' }}
                        src={'../../images/iphone13Pro-promo-image.jpeg'}
                        content={'iPhone 13 Pro for just:'}
                        price={1099}
                    />
                </TransitionSlider>
            )}
        </div>
    );
};

export default ProductsSideBar;

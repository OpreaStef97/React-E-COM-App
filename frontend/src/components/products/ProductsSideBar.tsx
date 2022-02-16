import { useLocation } from 'react-router-dom';
import Button from '../ui-components/Button';
import Offer from '../promoting/Offer';
import './ProductsSideBar.scss';
import useWindowWidth from '../../hooks/use-window-width';
import TransitionSlider from '../ui-components/TransitionSlider';

const ProductsSideBar = (props: { className?: string }) => {
    const { pathname } = useLocation();

    const width = useWindowWidth(null, null);

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
                    >
                        Tablets
                    </Button>
                </li>
                <li className="products__side-bar__list--item">
                    <Button to={'/products'} light link>
                        Others...
                    </Button>
                </li>
            </ul>
            <div className="separator"></div>
            {width > 1100 && (
                <>
                    <Offer
                        style={{ width: '40rem' }}
                        src={'../../images/S21-Ultra-promo-image.jpeg'}
                        content={'S21 Ultra for just:'}
                        price={899}
                        light
                    />
                    <div className="separator"></div>
                    <Offer
                        style={{ width: '40rem' }}
                        src={'../../images/iPhone13Pro-promo-image.jpeg'}
                        content={'iPhone 13 Pro for just:'}
                        price={1099}
                    />
                </>
            )}
            {width <= 1100 && (
                <TransitionSlider className="bg-color-1" transitionMs={150}>
                    <Offer
                        style={{ width: '60rem' }}
                        src={'../../images/S21-Ultra-promo-image.jpeg'}
                        content={'S21 Ultra for just:'}
                        price={899}
                        light
                    />
                    <Offer
                        style={{ width: '60rem' }}
                        src={'../../images/iPhone13Pro-promo-image.jpeg'}
                        content={'iPhone 13 Pro for just:'}
                        price={1099}
                    />
                </TransitionSlider>
            )}
        </div>
    );
};

export default ProductsSideBar;

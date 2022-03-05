import React from 'react';
import Button from '../ui-components/Button';
import Menu from './Menu';
import SlideImage from '../ui-components/SlideImage';
import './SlideShowMenu.scss';
import TransitionSlider from '../ui-components/TransitionSlider';
import { Storefront } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

const promoImages = [
    '../../../images/laptop-promo-photo.jpeg',
    '../../../images/tablet-promo-photo.jpeg',
    '../../../images/phone-promo-photo.jpeg',
];

const SlideShowMenu = React.forwardRef((props, ref) => {
    const navigate = useNavigate();

    return (
        <section className="slideshow-menu" ref={ref as React.LegacyRef<HTMLDivElement>}>
            <Menu />
            <div className="slideshow-menu-button">
                <Button link to={'/products'} inverse icon={<Storefront />} iconAfter>
                    SEE ALL
                </Button>
            </div>
            <div className="slideshow-menu__container">
                <TransitionSlider autoFlow dots flowTo="right" delay={5000} transitionMs={300}>
                    <SlideImage onClick={() => navigate('/products/laptops')} src={promoImages[0]}>
                        <div className="slideshow-menu-overlay">
                            <p>See our latest offers for laptops</p>
                        </div>
                    </SlideImage>
                    <SlideImage onClick={() => navigate('/products/tablets')} src={promoImages[1]}>
                        <div className="slideshow-menu-overlay">
                            <p>Choose a tablet from our wide range</p>
                        </div>
                    </SlideImage>
                    <SlideImage onClick={() => navigate('/products/phones')} src={promoImages[2]}>
                        <div className="slideshow-menu-overlay">
                            <p>Get the latest phones</p>
                        </div>
                    </SlideImage>
                </TransitionSlider>
            </div>
        </section>
    );
});

export default SlideShowMenu;

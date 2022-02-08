import React from 'react';
import useClickOutside from '../../hooks/use-clicks-outside';
import Button from '../ui-components/Button';
import Menu from './Menu';
import SlideImage from '../ui-components/SlideImage';
import './SlideShowMenu.scss';
import TransitionSlider from '../ui-components/TransitionSlider';

const promoImages = [
    '../../../images/laptop-promo-photo.jpeg',
    '../../../images/tablet-promo-photo.jpeg',
    '../../../images/phone-promo-photo.jpeg',
];

const SlideShowMenu = React.forwardRef((props, ref) => {
    const { clicked, clearClick } = useClickOutside(ref);

    return (
        <section className="slideshow-menu" ref={ref as React.LegacyRef<HTMLDivElement>}>
            <Menu clicked={clicked} onClear={clearClick} />
            <div className="slideshow-menu-overlay">
                <p>Get amazing products for the best price</p>
            </div>
            <div className="slideshow-menu-button">
                <Button link to={'/products'} inverse>
                    All Products
                </Button>
            </div>
            <div style={{ height: '70vh' }}>
                <TransitionSlider autoFlow dots flowTo="right" delay={5000} transitionMs={500}>
                    {promoImages.map((src, idx) => (
                        <SlideImage key={idx} src={src} />
                    ))}
                </TransitionSlider>
            </div>
        </section>
    );
});

export default SlideShowMenu;

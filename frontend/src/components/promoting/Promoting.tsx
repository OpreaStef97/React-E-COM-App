import Logo from '../ui-components/Logo';
import SlideImage from '../ui-components/SlideImage';
import TransitionSlider from '../ui-components/TransitionSlider';
import './Promoting.scss';

const promotingImgs = [
    '../../../images/photo-1623699316763-ed3bba0ba85e.jpeg',
    '../../../images/photo-1613690399151-65ea69478674.jpeg',
    '../../../images/pexels-photo-6407375.jpeg',
];
const Promoting = () => {
    return (
        <section className="promoting">
            <div className="promoting-description">
                <div className="promoting-description__over">
                    <Logo big light/>
                    <h2 className="promoting-description__header">
                        No matter how far your product will travel, it will be right at your door on
                        time.
                    </h2>
                </div>
            </div>

            <figure className="promoting-image__container">
                <TransitionSlider
                    autoFlow
                    dots
                    dotsPosition="end"
                    flowTo="left"
                    delay={8000}
                    transitionMs={300}
                >
                    {promotingImgs.map((src, idx) => (
                        <SlideImage key={idx} src={src} />
                    ))}
                </TransitionSlider>
            </figure>
        </section>
    );
};

export default Promoting;

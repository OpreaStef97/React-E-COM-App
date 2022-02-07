import useImageLoad from '../../hooks/use-image-load';
import LoadingSpinner from '../ui-components/LoadingSpinner';
import Logo from '../ui-components/Logo';
import './Offer.scss';

const Offer = (props: { content?: string; price?: number; src: string; light?: boolean }) => {
    const { src } = props;

    const imageLoaded = useImageLoad(src);

    return (
        <div className={`offer`}>
            <div className="offer--overlay">
                <Logo light={props.light} className="offer--overlay__logo" />
                <h4 className="offer--overlay__title-1">&nbsp;</h4>
                <h4 className="offer--overlay__title-2">Offer of the week</h4>
                <div className="offer--overlay__box">
                    <p className="offer--overlay__description">{props.content}</p>
                    <span className="offer--overlay__price">${props.price}</span>
                </div>
            </div>
            {!imageLoaded && <LoadingSpinner />}
            {imageLoaded && (
                <figure
                    className="offer--image"
                    style={{
                        backgroundImage: `linear-gradient(
                to right bottom,
                rgba(6, 62, 70, 0.3),
                rgba(230, 73, 128, 0.2)
            ),
            url(${props.src})`,
                    }}
                >
                    &nbsp;
                </figure>
            )}
        </div>
    );
};

export default Offer;

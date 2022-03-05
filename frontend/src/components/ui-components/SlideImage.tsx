import { FC, Fragment } from 'react';
import useImageLoad from '../../hooks/use-image-load';
import LoadingSpinner from './LoadingSpinner';
import './SlideImage.scss';

const linearGrd = 'linear-gradient(to right bottom, rgba(6, 62, 70, 0.9), rgba(230, 73, 128, 0.2))';

const SlideImage: FC<{ src: string; onClick?: () => void }> = props => {
    const { src } = props;
    const sourceLoaded = useImageLoad(src);
    return (
        <Fragment>
            {!sourceLoaded && <LoadingSpinner />}
            {sourceLoaded && (
                <div
                    className="slide-image"
                    onClick={props.onClick}
                    style={{
                        backgroundImage: `${linearGrd},url(${props.src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    {props.children}
                </div>
            )}
        </Fragment>
    );
};

export default SlideImage;

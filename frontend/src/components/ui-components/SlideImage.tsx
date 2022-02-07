import useImageLoad from "../../hooks/use-image-load";
import LoadingSpinner from "./LoadingSpinner";

const linearGrd = 'linear-gradient(to right bottom, rgba(6, 62, 70, 0.9), rgba(230, 73, 128, 0.2))';

const SlideImage = (props: { src: string }) => {
    const { src } = props;
    const sourceLoaded = useImageLoad(src);
    return (
        <>
            {!sourceLoaded && <LoadingSpinner />}
            {sourceLoaded && (
                <div
                    style={{
                        backgroundImage: `${linearGrd},url(${props.src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        height: '100%',
                        width: '100%',
                    }}
                ></div>
            )}
        </>
    );
};

export default SlideImage;

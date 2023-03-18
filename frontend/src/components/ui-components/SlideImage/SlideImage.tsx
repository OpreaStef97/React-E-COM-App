import { FC, Fragment, ReactNode, useState } from "react";
import { useImageLoad } from "../../../hooks";
import LoadingSpinner from "../LoadingSpinner";
import "./SlideImage.scss";

const linearGrd = "linear-gradient(to right bottom, rgba(6, 62, 70, 0.9), rgba(230, 73, 128, 0.2))";

const SlideImage: FC<{
    children?: ReactNode;
    src: string;
    onClick?: () => void;
    hoverable?: boolean;
}> = (props) => {
    const { src } = props;
    const sourceLoaded = useImageLoad(src);
    const [hover, setHover] = useState(false);

    return (
        <Fragment>
            {!sourceLoaded && <LoadingSpinner />}
            {sourceLoaded && (
                <div
                    className="slide-image"
                    onClick={props.onClick}
                    style={{
                        backgroundImage: `${linearGrd},url(${props.src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "100%",
                        width: "100%",
                        transform: hover ? "scale(1.05)" : "scale(1)",
                        transition: "all .2s",
                    }}
                    onMouseEnter={() => {
                        props.hoverable && setHover(true);
                    }}
                    onMouseLeave={() => {
                        props.hoverable && setHover(false);
                    }}
                >
                    {props.children}
                </div>
            )}
        </Fragment>
    );
};

export default SlideImage;

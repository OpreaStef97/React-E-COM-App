import { FC, useEffect } from 'react';
import './FillBar.scss';

const FillBar: FC<{
    fill?: number;
    id?: number;
    scrollKey?: number;
}> = props => {
    const { fill, id, scrollKey } = props;

    useEffect(() => {
        let styleSheet = document.styleSheets[0];
        let keyframes = `@keyframes fill${id || ''} {
            0% {
                width: 0%;
            }
            100% {
                width: ${fill}%;
            }
        }`;
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }, [fill, id]);

    return (
        <div className="bar">
            <div
                key={scrollKey}
                className="filler"
                style={{
                    width: `${fill}%`,
                    animation: `fill${id} ease-in 1s`,
                }}
            ></div>
        </div>
    );
};

export default FillBar;

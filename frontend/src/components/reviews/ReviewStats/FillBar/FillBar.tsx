import { FC } from 'react';
import Keyframes from '../../../ui-components/Keyframes/Keyframes';
import './FillBar.scss';

const FillBar: FC<{
    fill?: number;
    id?: number;
    scrollKey?: number;
}> = props => {
    const { fill, id, scrollKey } = props;

    return (
        <div className="bar">
            <Keyframes name={`fill${id}`} _0={{ width: `0%` }} _100={{ width: `${fill}%` }} />
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

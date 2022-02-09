import { FC } from 'react';
import useImageLoad from '../../hooks/use-image-load';

import './Avatar.scss';

const Avatar: FC<{ photo?: string; name?: string }> = props => {
    const loadedSrc = useImageLoad(props.photo || '');

    return (
        <div className="avatar">
            <span>{props.name}</span>
            {loadedSrc && (
                <img src={loadedSrc} alt={props.name} />
            )}
        </div>
    );
};

export default Avatar;

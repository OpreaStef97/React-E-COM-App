import { FC } from 'react';
import useImageLoad from '../../hooks/use-image-load';
import LoadingSpinner from '../ui-components/LoadingSpinner';
import './UserCard.scss';

const UserCard: FC<{
    idx?: number;
    imgSrc?: string;
    userName?: string;
    className?: string;
}> = props => {
    const sourceLoaded = useImageLoad(props.imgSrc || '');

    return (
        <div
            className={`user__card ${
                props?.idx !== undefined && `user__card--${props.idx} ${props.className}`
            }`}
        >
            {!sourceLoaded && <LoadingSpinner />}
            {sourceLoaded && (
                <img
                    className="user__card--img"
                    src={props.imgSrc}
                    alt={`${props.userName}'s avatar-img`}
                />
            )}
            <div>
                <p className="user__card--review">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam sint fuga dolorum
                    fugiat excepturi quis illo culpa esse.
                </p>
                <h2 className="user__card--name">{`-${props.userName}`}</h2>
            </div>
        </div>
    );
};

export default UserCard;

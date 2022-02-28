import { FC } from 'react';
import useImageLoad from '../../hooks/use-image-load';
import LoadingSpinner from '../ui-components/LoadingSpinner';
import Stars from '../ui-components/Stars';
import './UserCard.scss';

const UserCard: FC<{
    idx?: number;
    datePosted?: string;
    imgSrc?: string;
    userName?: string;
    className?: string;
    review?: string;
    rating?: number;
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
                {props.datePosted && (
                    <p className="user__card--review">{`${new Date(
                        props.datePosted || ''
                    ).toLocaleString()}`}</p>
                )}
                <p className="user__card--review">
                    {props.review ||
                        `Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam sint fuga dolorum
                        fugiat excepturi quis illo culpa esse.`}
                </p>
                <div className="user__card--name-stars">
                    <Stars rating={props.rating || 5} className="user__card--stars" />
                    <h2 className="user__card--name">{`-${props.userName}`}</h2>
                </div>
            </div>
        </div>
    );
};

export default UserCard;

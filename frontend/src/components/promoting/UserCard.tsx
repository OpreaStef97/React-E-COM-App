import { FC } from 'react';
import './UserCard.scss';

const UserCard: FC<{
    idx?: number;
    imgSrc?: string;
    userName?: string;
    className?: string;
}> = props => {
    return (
        <div
            className={`user__card ${
                props?.idx !== undefined &&
                `user__card--${props.idx} ${props.className}`
            }`}
        >
            <img
                className="user__card--img"
                src={props.imgSrc}
                alt={`${props.userName}'s avatar-img`}
            />
            <div>
                <p className="user__card--review">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam
                    sint fuga dolorum fugiat excepturi quis illo culpa esse.
                </p>
                <h2 className="user__card--name">{`-${props.userName}`}</h2>
            </div>
        </div>
    );
};

export default UserCard;

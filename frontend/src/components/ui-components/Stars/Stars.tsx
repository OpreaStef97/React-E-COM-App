import { Star, StarHalf } from 'phosphor-react';
import { FC } from 'react';
import './Stars.scss';

const Stars: FC<{ className?: string; rating: number }> = props => {
    const { rating } = props;

    return (
        <div className={`star-container ${props.className}`}>
            <>
                {[1, 2, 3, 4, 5].map((_, i) => {
                    if (i + 1 <= rating!)
                        return <Star opacity={1} key={i} weight="fill" className="star-icon" />;
                    else if (i <= rating && rating - Math.floor(rating) >= 0.5)
                        return <StarHalf opacity={1} weight="fill" key={i} className="star-icon" />;
                    else return <Star opacity={1} key={i} className="star-icon" />;
                })}
            </>
        </div>
    );
};

export default Stars;

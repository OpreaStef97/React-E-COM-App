import { FC } from 'react';
import UserCard from '../promoting/UserCard';
import Button from '../ui-components/Button';

const ReviewList: FC<{ reviews: any[]; onClick?: () => void; isLoading?: boolean }> = props => {
    const { reviews, onClick, isLoading } = props;

    return (
        <ul className="reviews-content-list" key={reviews.length} style={{ animation: 'fade .8s' }}>
            {reviews &&
                reviews.length > 0 &&
                reviews.map((review: any, i: number) => (
                    <li key={i} className="reviews-content-item">
                        <UserCard
                            key={i}
                            idx={1}
                            userName={review.user.name}
                            rating={review.rating}
                            review={review.review}
                            imgSrc={`${process.env.REACT_APP_RESOURCES_URL}/users/${review.user.photo}`}
                            datePosted={review.createdAt}
                        />
                    </li>
                ))}

            {reviews.length === 0 && !isLoading && (
                <div className="reviews-content-empty">
                    <p>
                        No reviews yet.
                        <br /> Be the first to write a review for this product:
                    </p>
                    <Button onClick={onClick} className="reviews-content-header--button">
                        Add a review
                    </Button>
                </div>
            )}
        </ul>
    );
};

export default ReviewList;

import React, { RefObject } from 'react';
import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/use-fetch';
import useImageLoad from '../../hooks/use-image-load';
import useInfiniteScroll from '../../hooks/use-infinite-scroll';
import useSelect from '../../hooks/use-select';
import ReviewModal from '../reviews/ReviewModal';
import Button from '../ui-components/Button';
import LoadingSpinner from '../ui-components/LoadingSpinner';
import Stars from '../ui-components/Stars';

import './MeReviews.scss';

const ReviewItem = React.forwardRef((props: { review: any; onClick: () => void }, ref) => {
    const navigate = useNavigate();

    const src = useImageLoad(
        `${process.env.REACT_APP_RESOURCES_URL}/products/${props.review.product?.images[0]}` || ''
    );

    return (
        <li className="me-reviews__item" ref={ref as unknown as RefObject<HTMLLIElement>}>
            {!src && <LoadingSpinner />}
            {src && (
                <img
                    onClick={() =>
                        navigate(
                            `/product/${props.review?.product.slug}/${props.review?.product.id}`
                        )
                    }
                    className="me-reviews__item--image"
                    src={src}
                    alt={props.review.name}
                />
            )}
            <div className="me-reviews__item--info-box">
                <h3>{props.review?.product.name}</h3>
                <p>{props.review.review}</p>
                <Stars className="me-reviews__item--stars" rating={props.review.rating} />
                <div className="me-reviews__item--modify">
                    <p>{new Date(props.review.createdAt).toLocaleString()}</p>
                    <Button className="me-reviews__item--btn" onClick={props.onClick}>
                        MODIFY
                    </Button>
                </div>
            </div>
        </li>
    );
});

const MeReviews: FC = props => {
    const [reviews, setReviews] = useState<any[]>([]);
    const { auth } = useSelector((state: any) => state);
    const { sendRequest, isLoading } = useFetch();
    const [selectTouched, setSelectTouched] = useState(false);
    const [addReview, setAddReview] = useState(false);
    const [ratingValue, setRatingValue] = useState<string>('');
    const [productId, setProductId] = useState('');
    const [checkReview, setCheckReview] = useState();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const { selectState, selectHandler, deleteHandler, setHandler } = useSelect({
        rating: {
            options: ['5⭐', '4⭐', '3⭐', '2⭐', '1⭐'],
            selected: [false, false, false, false, false],
        },
    });

    useEffect(() => {
        if (!auth.user.id) {
            return;
        }
        sendRequest({
            url: `${process.env.REACT_APP_API_URL}/users/${auth.user.id}/reviews?page=${page}&limit=4`,
            credentials: 'include',
        })
            .then(data => {
                setReviews(prev => [...prev, ...data.docs]);
                setHasMore(data.docs.length === 4);
            })
            .catch(setHasMore.bind(null, false));
    }, [auth.user.id, page, sendRequest]);

    const addReviewHandler = useCallback((checkReview?: any) => {
        setAddReview(prev => !prev);
        setSelectTouched(false);
        if (checkReview) {
            setProductId(checkReview.id);
            setCheckReview(checkReview);
        }
    }, []);

    const lastReviewRef = useInfiniteScroll({ isLoading, hasMore, setPage });

    useEffect(() => {
        if (!addReview)
            setHandler({
                rating: {
                    options: ['5⭐', '4⭐', '3⭐', '2⭐', '1⭐'],
                    selected: [false, false, false, false, false],
                },
            });
    }, [addReview, setHandler]);

    useEffect(() => {
        if (!selectState || !selectState.rating) {
            return;
        }
        const idx = selectState.rating.selected.findIndex((s: boolean) => s === true);
        const value = selectState.rating.options[idx];
        setRatingValue(value);
    }, [selectState]);

    useEffect(() => {
        const review = checkReview as any;
        if (review) {
            selectHandler('rating', `${review.rating}⭐`, false, false);
        }
    }, [checkReview, selectHandler]);

    return (
        <Fragment>
            <ReviewModal
                selectState={selectState}
                checkReview={checkReview}
                productId={productId}
                addReview={addReview}
                selectTouched={selectTouched}
                onReview={addReviewHandler}
                onTouch={() => setSelectTouched(true)}
                onSelect={selectHandler}
                onDelete={deleteHandler}
                value={ratingValue}
            />
            <div className="me-reviews">
                <ul className="me-reviews__content">
                    {reviews.length > 0 &&
                        reviews.map((item: any, i: number) => {
                            if (i + 1 === reviews.length) {
                                return (
                                    <ReviewItem
                                        ref={lastReviewRef}
                                        onClick={addReviewHandler.bind(null, item)}
                                        key={i}
                                        review={item}
                                    />
                                );
                            }

                            return (
                                <ReviewItem
                                    onClick={addReviewHandler.bind(null, item)}
                                    key={i}
                                    review={item}
                                />
                            );
                        })}
                    {!isLoading && reviews.length === 0 && (
                        <li key={Math.random()} className="me-reviews__item--empty">
                            <p>You don't have any review yet</p>
                        </li>
                    )}
                    {isLoading && (
                        <li className="me-reviews__item--empty">
                            <LoadingSpinner />
                        </li>
                    )}
                </ul>
            </div>
        </Fragment>
    );
};

export default MeReviews;

import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/use-fetch';

import useReviewSort from '../../hooks/use-review-sort';
import useSelect from '../../hooks/use-select';
import { delayedNotification } from '../../store/ui-slice';
import MenuSelect from '../form/MenuSelect';
import Button from '../ui-components/Button';
import ReviewList from './ReviewList';
import ReviewStats from './ReviewStats';
import './Reviews.scss';
import ReviewModal from './ReviewModal';

const Reviews: FC<{ rating?: number; productId?: string }> = props => {
    const { productId } = props;
    const [reviews, setReviews] = useState([]);
    const [addReview, setAddReview] = useState(false);
    const [selectTouched, setSelectTouched] = useState(false);
    const { auth } = useSelector((state: any) => state);
    const { sendRequest, isLoading } = useFetch();
    const [length, setLength] = useState<number>();
    const [checkReview, setCheckReview] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [ratingValue, setRatingValue] = useState<string>('');

    const { selectState, selectHandler, deleteHandler } = useSelect({
        rating: {
            options: ['5⭐', '4⭐', '3⭐', '2⭐', '1⭐'],
            selected: [false, false, false, false, false],
        },
        sortR: {
            options: ['Top rated', 'Low rated'],
            selected: [false, false],
        },
        sortD: {
            options: ['Newest', 'Oldest'],
            selected: [false, false],
        },
    });

    const { sortingD, sortingR } = useReviewSort(selectState);

    useEffect(() => {
        sendRequest({
            url: `${process.env.REACT_APP_API_URL}/products/${productId}/reviews?sort=${
                sortingR || sortingD
            }`,
        })
            .then(data => {
                setReviews(data.docs);
                setLength(data.docs.length);
                setCheckReview(prevCheck => {
                    const newCheck = data.docs.find(
                        (review: any) => review.user.id === auth.user.id
                    );
                    if (JSON.stringify(prevCheck) === JSON.stringify(newCheck)) {
                        return prevCheck;
                    }
                    return newCheck;
                });
            })
            .catch(console.error);
        return () => setReviews([]);
    }, [sendRequest, productId, sortingD, sortingR, auth.user.id]);

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

    const addReviewHandler = useCallback(() => {
        if (auth.isLoggedIn) {
            setAddReview(prev => !prev);
            setSelectTouched(false);
        } else {
            navigate('/auth', {
                state: { from: location.pathname },
            });
            dispatch(
                delayedNotification({
                    delay: 300,
                    message: 'Please authenticate before adding a review',
                    status: 'error',
                })
            );
        }
    }, [auth.isLoggedIn, dispatch, location.pathname, navigate]);

    return (
        <Fragment>
            <ReviewModal
                value={ratingValue}
                selectState={selectState}
                checkReview={checkReview}
                productId={productId || ''}
                addReview={addReview}
                selectTouched={selectTouched}
                onReview={addReviewHandler}
                onSelect={selectHandler}
                onDelete={deleteHandler}
                onTouch={() => setSelectTouched(true)}
            />
            <div className="reviews">
                <div className="reviews-content">
                    <div className="reviews-content-header">
                        <h3>Reviews</h3>
                        {Object.keys(selectState).length > 0 && (
                            <>
                                <MenuSelect
                                    id={'sortR'}
                                    placeholder={'Sort by rating..'}
                                    options={selectState.sortR}
                                    uniqueSelect
                                    onSelect={selectHandler}
                                    onDelete={deleteHandler}
                                />
                                <MenuSelect
                                    id={'sortD'}
                                    placeholder={'Sort by date..'}
                                    options={selectState.sortD}
                                    uniqueSelect
                                    onSelect={selectHandler}
                                    onDelete={deleteHandler}
                                />
                            </>
                        )}
                        <Button
                            onClick={addReviewHandler}
                            className="reviews-content-header--button"
                        >
                            {checkReview ? 'Modify review' : 'Add a review'}
                        </Button>
                    </div>
                    <ReviewStats length={length || 0} rating={props.rating} />
                    <ReviewList
                        reviews={reviews}
                        onClick={addReviewHandler}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </Fragment>
    );
};

export default Reviews;

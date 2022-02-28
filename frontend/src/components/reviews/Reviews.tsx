import { CircleNotch } from 'phosphor-react';
import React, { FC, Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/use-fetch';
import { useForm } from '../../hooks/use-form';
import useReviewSort from '../../hooks/use-review-sort';
import useSelect from '../../hooks/use-select';
import { delayedNotification, uiActions } from '../../store/ui-slice';
import { VALIDATOR_REQUIRE } from '../../utils/validators';
import Input from '../form/Input';
import MenuSelect from '../form/MenuSelect';
import Button from '../ui-components/Button';
import Modal from '../ui-components/Modal';
import ReviewList from './ReviewList';
import './Reviews.scss';
import ReviewStats from './ReviewStats';

const Reviews: FC<{ rating?: number; id?: string }> = props => {
    const { id } = props;
    const [reviews, setReviews] = useState([]);
    const [addReview, setAddReview] = useState(false);
    const [selectTouched, setSelectTouched] = useState(false);
    const { auth } = useSelector((state: any) => state);
    const { sendRequest, isLoading } = useFetch();
    const [deleteReview, setDeleteReview] = useState(false);
    const [length, setLength] = useState<number>();
    const [checkReview, setCheckReview] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();
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

    const [formState, inputHandler] = useForm(
        { rating: { value: '', isValid: false }, review: { value: '', isValid: false } },
        false
    );

    const options = useMemo(() => {
        if (!selectState.rating) return [];
        return selectState.rating.options;
    }, [selectState]);

    const { sortingD, sortingR } = useReviewSort(selectState);

    useEffect(() => {
        sendRequest(
            `${process.env.REACT_APP_API_URL}/products/${id}/reviews?sort=${sortingR || sortingD}`
        )
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
    }, [sendRequest, id, sortingD, sortingR, auth.user.id]);

    useEffect(() => {
        if (!selectState || !selectState.rating) {
            return;
        }
        const idx = selectState.rating.selected.findIndex((s: boolean) => s === true);
        const value = selectState.rating.options[idx];
        inputHandler('rating', value, !!value);
    }, [selectState, inputHandler]);

    useEffect(() => {
        const review = checkReview as any;
        if (review) {
            selectHandler('rating', `${review.rating}⭐`, false, false);
        }
    }, [checkReview, selectHandler, options]);

    const addReviewHandler = () => {
        if (auth.isLoggedIn) {
            setAddReview(prev => !prev);
            setSelectTouched(false);
        } else {
            navigate('/auth');
        }
    };

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        if (!formState.isValid && !deleteReview) {
            return;
        }
        sendRequest(
            `${process.env.REACT_APP_API_URL}/products/${id}/reviews/${
                checkReview ? (checkReview as any).id : ''
            }`,
            checkReview ? (deleteReview ? 'DELETE' : 'PATCH') : 'POST',
            {
                'Content-Type': 'application/json',
                'x-csrf-token': auth.csrfToken,
            },
            deleteReview
                ? ''
                : JSON.stringify({
                      rating: parseInt(formState.inputs.rating?.value?.slice(0, 1) as string),
                      review: formState.inputs.review?.value,
                  }),
            'include'
        )
            .then(data => {
                setAddReview(prev => !prev);
                dispatch(
                    delayedNotification({
                        delay: 200,
                        status: 'success',
                        message: checkReview
                            ? deleteReview
                                ? 'Review Deleted'
                                : 'Review Updated'
                            : 'Thank you for your review!',
                    })
                );
                dispatch(uiActions.setUIReset());
            })
            .catch(err => setAddReview(prev => !prev));

        setDeleteReview(false);
    };

    return (
        <Fragment>
            <Modal
                show={addReview}
                onCancel={addReviewHandler}
                header={checkReview ? 'Modify Review' : 'Write a review'}
                headerClass="modal-review__header"
                footer={
                    <div className="modal-review__footer">
                        <Button
                            className="modal-review__btn modal-review__btn--submit"
                            disabled={!formState.isValid}
                            role="submit"
                        >
                            {isLoading && <CircleNotch className="load" />}
                            {!isLoading && 'SUBMIT'}
                        </Button>
                        {checkReview && (
                            <Button
                                onClick={() => setDeleteReview(true)}
                                className="modal-review__btn"
                                role="submit"
                            >
                                {isLoading && <CircleNotch className="load" />}
                                {!isLoading && 'DELETE'}
                            </Button>
                        )}
                    </div>
                }
                onSubmit={submitHandler}
            >
                <div className="modal-review__content">
                    <MenuSelect
                        id={'rating'}
                        className="modal-review__menu"
                        placeholder="Select rating.."
                        options={selectState['rating']}
                        uniqueSelect
                        errorText="Select rating!"
                        error={!formState.inputs.rating?.isValid && selectTouched}
                        onSelect={selectHandler}
                        onDelete={deleteHandler}
                        onTouch={() => setSelectTouched(true)}
                    />
                    <Input
                        id="review"
                        type="textarea"
                        label="Add a review:"
                        validators={[VALIDATOR_REQUIRE()]}
                        onInput={inputHandler}
                        initialValid={!!checkReview}
                        initialValue={(checkReview as any)?.review || ''}
                    />
                </div>
            </Modal>
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

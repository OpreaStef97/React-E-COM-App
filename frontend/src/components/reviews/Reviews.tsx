import { CircleNotch } from 'phosphor-react';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import useFetch from '../../hooks/use-fetch';
import { useForm } from '../../hooks/use-form';
import useSelect from '../../hooks/use-select';
import { VALIDATOR_REQUIRE } from '../../utils/validators';
import Input from '../form/Input';
import MenuSelect from '../form/MenuSelect';
import UserCard from '../promoting/UserCard';
import Button from '../ui-components/Button';
import Modal from '../ui-components/Modal';
import './Reviews.scss';
import ReviewStats from './ReviewStats';

const Reviews: FC = props => {
    const [reviews, setReviews] = useState([]);
    const [addReview, setAddReview] = useState(false);
    const [selectTouched, setSelectTouched] = useState(false);
    const { sendRequest, isLoading } = useFetch();
    const params = useParams();
    const { csrfToken } = useSelector((state: any) => state.auth);
    const { selectState, setHandler, selectHandler, deleteHandler } = useSelect();
    const [formState, inputHandler] = useForm(
        {
            rating: {
                value: '',
                isValid: false,
            },
            review: {
                value: '',
                isValid: false,
            },
        },
        false
    );
    useEffect(() => {
        sendRequest(`${process.env.REACT_APP_API_URL}/products/${params.id}/reviews`)
            .then(data => {
                setReviews(data.docs);
            })
            .catch(console.error);

        return () => setReviews([]);
    }, [sendRequest, params]);

    useEffect(() => {
        setHandler({
            rating: {
                options: ['1⭐', '2⭐', '3⭐', '4⭐', '5⭐'],
                selected: [false, false, false, false, false],
            },
        });
    }, [setHandler]);

    useEffect(() => {
        if (!selectState || !selectState.rating) {
            return;
        }
        const idx = selectState.rating.selected.findIndex((s: boolean) => s === true);
        const value = selectState.rating.options[idx];
        inputHandler('rating', value, !!value);
    }, [selectState, inputHandler]);

    const addReviewHandler = () => {
        setAddReview(prev => !prev);
        setSelectTouched(false);
    };

    const submitHandler = (event: React.FormEvent) => {
        event.preventDefault();
        if (!formState.isValid) {
            return;
        }
        sendRequest(
            `${process.env.REACT_APP_API_URL}/products/${params.id}/reviews`,
            'POST',
            {
                'Content-Type': 'application/json',
                'x-csrf-token': csrfToken,
            },
            JSON.stringify({
                rating: parseInt(formState.inputs.rating?.value?.slice(0, 1) as string),
                review: formState.inputs.review?.value,
            }),
            'include'
        )
            .then(data => {
                setAddReview(prev => !prev);
            })
            .catch(err => {
                setAddReview(prev => !prev);
            });
    };

    return (
        <>
            <Modal
                show={addReview}
                onCancel={addReviewHandler}
                header={'Write a review'}
                headerClass="modal-review__header"
                footer={
                    <Button
                        className="modal-review__btn"
                        disabled={!formState.isValid}
                        role="submit"
                    >
                        {isLoading && <CircleNotch className="load" />}
                        {!isLoading && 'SUBMIT'}
                    </Button>
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
                    />
                </div>
            </Modal>
            <div className="reviews">
                <div className="reviews-content">
                    <div className="reviews-content-header">
                        <h3>Reviews</h3>
                        <MenuSelect
                            id={'sort-rating'}
                            placeholder={'Sort by rating..'}
                            options={{
                                options: ['Top rated', 'Low Rated'],
                                selected: [false, false],
                            }}
                        />
                        <MenuSelect
                            id={'sort-date'}
                            placeholder={'Sort by date..'}
                            options={{
                                options: ['Top rated', 'Low Rated'],
                                selected: [false, false],
                            }}
                        />
                        <Button
                            onClick={addReviewHandler}
                            className="reviews-content-header--button"
                        >
                            Add a review
                        </Button>
                    </div>
                    <ReviewStats reviews={reviews} />
                    <ul className="reviews-content-list">
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
                                        imgSrc={`${process.env.REACT_APP_RESOURCES_URL}/images/users/${review.user.photo}`}
                                    />
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Reviews;

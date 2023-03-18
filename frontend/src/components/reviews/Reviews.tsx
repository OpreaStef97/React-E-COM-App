import { FC, useState, useEffect, useCallback, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useFetch, useSelect, useInfiniteScroll } from "../../hooks";
import { AuthType } from "../../store/auth";
import { delayedNotification } from "../../store/ui";
import UserCard from "../promoting/UserCard";
import { Button, LoadingSpinner } from "../ui-components";
import ReviewModal from "./ReviewModal";
import ReviewStats from "./ReviewStats";
import "./Reviews.scss";

const Reviews: FC<{
    rating?: number;
    productId?: string;
    selectMenu?: JSX.Element;
    sorting?: string;
    userReview?: any;
}> = (props) => {
    const { productId } = props;
    const [reviews, setReviews] = useState<any[]>([]);
    const [addReview, setAddReview] = useState(false);
    const [selectTouched, setSelectTouched] = useState(false);
    const { auth } = useSelector((state: { auth: AuthType }) => state);
    const { sendRequest, isLoading } = useFetch();
    const [length, setLength] = useState<number>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [ratingValue, setRatingValue] = useState<string>("");
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const { selectState, selectHandler, deleteHandler, setHandler } = useSelect();

    useEffect(() => {
        const ratingOptions = ["5⭐", "4⭐", "3⭐", "2⭐", "1⭐"];
        setHandler({
            rating: { options: ratingOptions, selected: ratingOptions.map(() => false) },
        });
    }, [setHandler]);

    useEffect(() => {
        if (!productId || !hasMore) {
            return;
        }
        sendRequest({
            url: `${process.env.REACT_APP_API_URL}/products/${productId}/reviews?page=${page}&limit=4&sort=${props.sorting}`,
        })
            .then((data) => {
                setReviews((prev: any) => {
                    return [...prev, ...data.docs];
                });
                setLength(data.totalLength);
                setHasMore(data.docs.length === 4);
            })
            .catch(setHasMore.bind(null, false));
    }, [sendRequest, productId, page, props.sorting, hasMore]);

    useEffect(() => {
        if (!selectState || !selectState.rating) {
            return;
        }
        const idx = selectState.rating.selected.findIndex((s: boolean) => s === true);
        const value = selectState.rating.options[idx];
        setRatingValue(value);
    }, [selectState]);

    const { userReview } = props;

    useEffect(() => {
        if (userReview) {
            selectHandler("rating", `${userReview.rating}⭐`, false, false);
        }
    }, [userReview, selectHandler]);

    const addReviewHandler = useCallback(() => {
        if (auth.isLoggedIn) {
            setAddReview((prev) => !prev);
            setSelectTouched(false);
        } else {
            navigate("/auth", {
                state: { from: location.pathname },
            });
            dispatch(
                delayedNotification({
                    delay: 300,
                    message: "Please authenticate before adding a review",
                    status: "warn",
                })
            );
        }
    }, [auth.isLoggedIn, dispatch, location.pathname, navigate]);

    const lastReviewRef = useInfiniteScroll({ hasMore, setPage, isLoading });

    return (
        <Fragment>
            <ReviewModal
                value={ratingValue}
                selectState={selectState}
                checkReview={userReview}
                productId={productId || ""}
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
                        {props.selectMenu}
                        <Button
                            onClick={addReviewHandler}
                            className="reviews-content-header--button"
                        >
                            {userReview ? "Modify review" : "Add a review"}
                        </Button>
                    </div>
                    <ReviewStats length={length || 0} rating={props.rating} />
                    <ul
                        className="reviews-content-list"
                        key={props.sorting}
                        style={{ animation: "fade .8s" }}
                    >
                        {reviews.length > 0 &&
                            reviews.map((review: any, i: number) => {
                                if (i + 1 === reviews.length) {
                                    return (
                                        <li
                                            key={i}
                                            className="reviews-content-item"
                                            ref={lastReviewRef}
                                        >
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
                                    );
                                }

                                return (
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
                                );
                            })}
                        {isLoading && (
                            <li className="reviews-content-empty">
                                <LoadingSpinner />
                            </li>
                        )}
                        {reviews.length === 0 && !isLoading && (
                            <li className="reviews-content-empty">
                                <p>
                                    No reviews yet.
                                    <br /> Be the first to write a review for this product:
                                </p>
                                <Button
                                    onClick={addReviewHandler}
                                    className="reviews-content-header--button"
                                >
                                    Add a review
                                </Button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </Fragment>
    );
};

export default Reviews;

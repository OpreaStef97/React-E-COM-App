import { FC, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SelectState, useFetch, useForm } from "../../../hooks";
import { AuthType } from "../../../store/auth";
import { delayedNotification, delayedUIReset, uiActions } from "../../../store/ui";
import { VALIDATOR_REQUIRE } from "../../../utils/validators";
import { MenuSelect, Input } from "../../form";
import { Modal, Button, LoadingSpinner } from "../../ui-components";
import "./ReviewModal.scss";

const ReviewModal: FC<{
    selectState: SelectState;
    checkReview?: any;
    productId: string;
    addReview: boolean;
    selectTouched: boolean;
    value: string;
    onReview: () => void;
    onTouch: () => void;
    onSelect: (...args: any[]) => void;
    onDelete: (...args: any) => void;
}> = (props) => {
    const { selectState, checkReview, productId, addReview, selectTouched } = props;
    const [deleteReview, setDeleteReview] = useState(false);
    const { auth } = useSelector((state: { auth: AuthType }) => state);
    const { sendRequest, isLoading } = useFetch();
    const dispatch = useDispatch();

    const [formState, inputHandler] = useForm(
        { rating: { value: "", isValid: false }, review: { value: "", isValid: false } },
        false
    );

    useEffect(() => {
        inputHandler("rating", props.value, !!props.value);
    }, [inputHandler, props.value]);

    const submitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!formState.isValid && !deleteReview) {
            return;
        }
        try {
            await sendRequest({
                url: `${process.env.REACT_APP_API_URL}/products/${productId}/reviews/${
                    checkReview ? (checkReview as any).id : ""
                }`,
                method: checkReview ? (deleteReview ? "DELETE" : "PATCH") : "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": auth.csrfToken,
                },
                body: deleteReview
                    ? {}
                    : {
                          rating: parseInt(formState.inputs.rating?.value?.slice(0, 1) as string),
                          review: formState.inputs.review?.value,
                      },
                credentials: "include",
            });
            dispatch(
                delayedNotification({
                    delay: 500,
                    status: "success",
                    message: checkReview
                        ? deleteReview
                            ? "Review Deleted"
                            : "Review Updated"
                        : "Thank you for your review!",
                })
            );
            dispatch(delayedUIReset({ delay: 300 }));
            props.onReview();
        } catch (err) {
            dispatch(
                delayedNotification({
                    delay: 500,
                    status: "error",
                    message: err instanceof Error ? err.message : "Something went wrong",
                })
            );
            dispatch(uiActions.setUIReset());
            props.onReview();
        }
        setDeleteReview(false);
    };

    return (
        <Modal
            show={addReview}
            onCancel={props.onReview}
            header={checkReview ? "Modify Review" : "Write a review"}
            headerClass="modal-review__header"
            footer={
                <div className="modal-review__footer">
                    {!isLoading && (
                        <>
                            <Button
                                className="modal-review__btn modal-review__btn--submit"
                                disabled={!formState.isValid}
                                role="submit"
                            >
                                {!isLoading && "SUBMIT"}
                            </Button>
                            {checkReview && (
                                <Button
                                    onClick={() => setDeleteReview(true)}
                                    className="modal-review__btn"
                                    role="submit"
                                >
                                    {!isLoading && "DELETE"}
                                </Button>
                            )}
                        </>
                    )}
                </div>
            }
            onSubmit={submitHandler}
        >
            {!isLoading && (
                <div className="modal-review__content">
                    <MenuSelect
                        id={"rating"}
                        className="modal-review__menu"
                        placeholder="Select rating.."
                        options={selectState["rating"]}
                        uniqueSelect
                        errorText="Select rating!"
                        error={!formState.inputs.rating?.isValid && selectTouched}
                        onSelect={props.onSelect}
                        onDelete={props.onDelete}
                        onTouch={props.onTouch}
                    />
                    <Input
                        id="review"
                        type="textarea"
                        label="Add a review:"
                        validators={[VALIDATOR_REQUIRE()]}
                        onInput={inputHandler}
                        initialValid={!!checkReview}
                        initialValue={(checkReview as any)?.review || ""}
                    />
                </div>
            )}
            {isLoading && <LoadingSpinner />}
        </Modal>
    );
};

export default ReviewModal;

import { FC, useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFetch, useForm } from "../../../hooks";
import { AuthType } from "../../../store/auth";
import { delayedUIReset, delayedNotification, uiActions } from "../../../store/ui";
import { VALIDATOR_MINLENGTH } from "../../../utils/validators";
import { Input } from "../../form";
import { Button } from "../../ui-components";

const MeInfoPassForm: FC = (props) => {
    const { isLoading, sendRequest } = useFetch();
    const dispatch = useDispatch();
    const { auth } = useSelector((state) => state) as { auth: AuthType };

    const passwordCurrentId = useId();
    const passwordId = useId();
    const passwordConfirmId = useId();

    const [formPState, inputPHandler] = useForm(
        {
            [passwordCurrentId]: {
                value: "",
                isValid: false,
            },
            [passwordId]: {
                value: "",
                isValid: false,
            },
            [passwordConfirmId]: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formPState.isValid) return;

        try {
            await sendRequest({
                url: `${process.env.REACT_APP_API_URL}/users/update-password`,
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": auth.csrfToken,
                },
                body: {
                    passwordCurrent: formPState.inputs[passwordCurrentId]?.value,
                    password: formPState.inputs[passwordId]?.value,
                    passwordConfirm: formPState.inputs[passwordConfirmId]?.value,
                },
                credentials: "include",
            });

            dispatch(delayedUIReset({ delay: 500 }));
            dispatch(
                delayedNotification({
                    delay: 300,
                    status: "success",
                    message: "Password updated successfully",
                })
            );
        } catch (err) {
            dispatch(
                uiActions.showNotification({
                    status: "error",
                    message: err instanceof Error ? err.message : "Something went wrong",
                })
            );
        }
    };

    return (
        <form className="me-info__form me-info__form-pass" onSubmit={submitHandler}>
            <h3>Update your password</h3>
            <Input
                className="me-info__pass-input"
                element="input"
                labelClassName="me-info__label"
                type="password"
                label="Current Password:"
                validators={[VALIDATOR_MINLENGTH(8)]}
                errorText="Please enter a password with at least 8 characters"
                onInput={inputPHandler}
            />
            <Input
                className="me-info__pass-input"
                element="input"
                labelClassName="me-info__label"
                type="password"
                label="New Password:"
                validators={[VALIDATOR_MINLENGTH(8)]}
                errorText="Please enter a password with at least 8 characters"
                onInput={inputPHandler}
            />
            <Input
                className="me-info__pass-input"
                element="input"
                labelClassName="me-info__label"
                type="password"
                label="Password Confirm:"
                validators={[VALIDATOR_MINLENGTH(8)]}
                errorText="Please enter a password with at least 8 characters"
                onInput={inputPHandler}
            />
            <Button role="submit" disabled={!formPState.isValid} loading={isLoading}>
                SUBMIT
            </Button>
        </form>
    );
};

export default MeInfoPassForm;

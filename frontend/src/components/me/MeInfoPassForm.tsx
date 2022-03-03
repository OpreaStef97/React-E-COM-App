import { CircleNotch } from 'phosphor-react';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from '../../hooks/use-fetch';
import { useForm } from '../../hooks/use-form';
import { delayedUIReset, delayedNotification, uiActions } from '../../store/ui-slice';
import { VALIDATOR_MINLENGTH } from '../../utils/validators';
import Input from '../form/Input';
import Button from '../ui-components/Button';

const MeInfoPassForm: FC = props => {
    const { isLoading, sendRequest } = useFetch();
    const dispatch = useDispatch();
    const { auth } = useSelector((state: any) => state);

    const [formPState, inputPHandler] = useForm(
        {
            passwordCurrent: {
                value: '',
                isValid: false,
            },
            password: {
                value: '',
                isValid: false,
            },
            passwordConfirm: {
                value: '',
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
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': auth.csrfToken,
                },
                body: {
                    passwordCurrent: formPState.inputs.passwordCurrent?.value,
                    password: formPState.inputs.password?.value,
                    passwordConfirm: formPState.inputs.passwordConfirm?.value,
                },
                credentials: 'include',
            });

            dispatch(delayedUIReset({ delay: 500 }));
            dispatch(
                delayedNotification({
                    delay: 300,
                    status: 'success',
                    message: 'Password updated successfully',
                })
            );
        } catch (err) {
            dispatch(
                uiActions.showNotification({
                    status: 'error',
                    message: err instanceof Error ? err.message : 'Something went wrong',
                })
            );
        }
    };

    return (
        <form className="me-info__form" onSubmit={submitHandler}>
            <h3>Update your password</h3>
            <Input
                id="passwordCurrent"
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
                id="password"
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
                id="passwordConfirm"
                className="me-info__pass-input"
                element="input"
                labelClassName="me-info__label"
                type="password"
                label="Password Confirm:"
                validators={[VALIDATOR_MINLENGTH(8)]}
                errorText="Please enter a password with at least 8 characters"
                onInput={inputPHandler}
            />
            <Button role="submit" disabled={!formPState.isValid}>
                {isLoading && <CircleNotch className="me-info--load" />}
                {!isLoading && 'SUBMIT'}
            </Button>
        </form>
    );
};

export default MeInfoPassForm;

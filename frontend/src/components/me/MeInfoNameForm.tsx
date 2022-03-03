import { CircleNotch } from 'phosphor-react';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useFetch from '../../hooks/use-fetch';
import { useForm } from '../../hooks/use-form';
import { delayedNotification, uiActions } from '../../store/ui-slice';
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MAXLENGTH,
    VALIDATOR_EMAIL,
    VALIDATOR_PHONE,
} from '../../utils/validators';
import Input from '../form/Input';
import Button from '../ui-components/Button';

const MeInfoNameForm: FC = props => {
    const { isLoading, sendRequest } = useFetch();
    const dispatch = useDispatch();
    const { auth } = useSelector((state: any) => state);

    const [formNState, inputNHandler] = useForm(
        {
            email: {
                value: '',
                isValid: false,
            },
            name: {
                value: '',
                isValid: false,
            },
            phone: {
                value: null,
                isValid: false,
            },
        },
        false
    );

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formNState.isValid) return;
        try {
            await sendRequest({
                url: `${process.env.REACT_APP_API_URL}/users/update-me`,
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': auth.csrfToken,
                },
                body: {
                    name: formNState.inputs.name?.value,
                    email: formNState.inputs.email?.value,
                    phone: formNState.inputs.phone?.value,
                },
                credentials: 'include',
            });
            dispatch(
                delayedNotification({
                    delay: 500,
                    status: 'success',
                    message: 'Account Info updated successfully',
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
            <h3>Change your account info</h3>
            <Input
                element="input"
                id="name"
                type="text"
                className="me-info__text-input"
                labelClassName="me-info__label"
                label="Name:"
                validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(15)]}
                errorText="Please enter a name"
                initialValue={auth.user.name}
                initialValid={true}
                onInput={inputNHandler}
            />
            <Input
                id="email"
                element="input"
                labelClassName="me-info__label"
                type="email"
                className="me-info__text-input"
                label="Email:"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter valid email"
                initialValue={auth.user.email}
                initialValid={true}
                onInput={inputNHandler}
            />
            <Input
                id="phone"
                element="input"
                labelClassName="me-info__label"
                type="tel"
                className="me-info__text-input"
                label="Phone:"
                validators={[VALIDATOR_MAXLENGTH(15), VALIDATOR_PHONE()]}
                errorText="Please enter valid phone number"
                initialValue={auth.user.phone.split('.').join(' ')}
                initialValid={true}
                onInput={inputNHandler}
            />

            <Button role="submit" disabled={!formNState.isValid}>
                {isLoading && <CircleNotch className="me-info--load" />}
                {!isLoading && 'SUBMIT'}
            </Button>
        </form>
    );
};
export default MeInfoNameForm;

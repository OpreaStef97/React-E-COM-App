import { CircleNotch } from 'phosphor-react';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../components/form/Input';
import Button from '../../components/ui-components/Button';
import ErrorModal from '../../components/ui-components/ErrorModal';
import useFetch from '../../hooks/use-fetch';
import { useForm } from '../../hooks/use-form';
import { authActions } from '../../store/auth-slice';
import { modifyCartData } from '../../store/cart-actions';
import { modifyFavData } from '../../store/fav-actions';
import { delayedNotification } from '../../store/ui-slice';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MAXLENGTH,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from '../../utils/validators';
import './Auth.scss';

const Auth: FC = props => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [disable, setDisabled] = useState(true);
    const { isLoading, error, clearError, sendRequest } = useFetch();
    const { csrfToken } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false,
            },
            password: {
                value: '',
                isValid: false,
            },
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLoginMode) {
            const formStateObj = { ...formState.inputs };
            delete formStateObj.name;
            delete formStateObj.passwordConfirm;
            setFormData(
                formStateObj,
                !!formState.inputs.email?.isValid && !!formState.inputs.password?.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
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
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authSubmitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const data = await sendRequest(
                `${process.env.REACT_APP_API_URL}/users/${isLoginMode ? 'login' : 'signup'}`,
                'POST',
                {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken,
                },
                JSON.stringify(
                    isLoginMode
                        ? {
                              email: formState.inputs.email?.value,
                              password: formState.inputs.password?.value,
                          }
                        : {
                              name: formState.inputs.name?.value,
                              email: formState.inputs.email?.value,
                              password: formState.inputs.password?.value,
                              passwordConfirm: formState.inputs.passwordConfirm?.value,
                          }
                ),
                'include'
            );
            setDisabled(true);
            dispatch(
                delayedNotification({
                    status: 'success',
                    delay: 400,
                    message: `Welcome ${data.user.name.split(' ')[0]}`,
                })
            );
            dispatch(authActions.loggingIn(data.user));
            if (data.user.cart) dispatch(modifyCartData(data.user.cart, csrfToken));
            if (data.user.favorites) dispatch(modifyFavData(data.user.favorites, csrfToken));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        setDisabled(!formState.isValid);
    }, [formState.isValid]);

    return (
        <section className="auth">
            <div className="auth-container">
                <ErrorModal
                    error={error}
                    onClear={(e: React.MouseEvent) => {
                        e.preventDefault();
                        clearError();
                    }}
                />
                <h2>{isLoginMode ? 'Authenticate' : 'Create an account'}</h2>
                <div className="separator" style={{ backgroundColor: '#063e46' }}></div>
                <form className="auth-form" onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            element="input"
                            id="name"
                            type="text"
                            label="Name:"
                            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(15)]}
                            errorText="Please enter a name"
                            onInput={inputHandler}
                        />
                    )}
                    <Input
                        id="email"
                        element="input"
                        type="email"
                        label="Email:"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter valid email"
                        onInput={inputHandler}
                    />
                    <Input
                        id="password"
                        element="input"
                        type="password"
                        label="Password:"
                        validators={[VALIDATOR_MINLENGTH(8)]}
                        errorText="Please enter a password with at least 8 characters"
                        onInput={inputHandler}
                    />
                    {!isLoginMode && (
                        <Input
                            id="passwordConfirm"
                            element="input"
                            type="password"
                            label="Password Confirm:"
                            validators={[VALIDATOR_MINLENGTH(8)]}
                            errorText="Please enter a password with at least 8 characters"
                            onInput={inputHandler}
                        />
                    )}
                    <Button
                        className="auth-btn"
                        role="submit"
                        style={{ transform: 'scale(1.2)' }}
                        disabled={disable}
                    >
                        {isLoading && <CircleNotch className="auth-form--load" />}
                        {!isLoading && `${isLoginMode ? 'LOGIN' : 'SIGNUP'}`}
                    </Button>
                </form>
                <div className="separator" style={{ backgroundColor: '#063e46' }}></div>
                {isLoginMode && (
                    <p className="auth-paragraph">New to ReactECOM? Create an account now &darr;</p>
                )}
                <Button
                    className="auth-btn"
                    role="button"
                    inverse
                    style={{ width: '18rem' }}
                    onClick={switchModeHandler}
                >
                    SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
                </Button>
            </div>
        </section>
    );
};

export default Auth;

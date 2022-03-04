import { CircleNotch } from 'phosphor-react';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../../components/form/Input';
import Button from '../../components/ui-components/Button';
import useFetch from '../../hooks/use-fetch';
import { useForm } from '../../hooks/use-form';
import { authActions } from '../../store/auth-slice';
import { modifyCartData } from '../../store/cart-actions';
import { modifyFavData } from '../../store/fav-actions';
import { delayedNotification, uiActions } from '../../store/ui-slice';
import sleep from '../../utils/sleep';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MAXLENGTH,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from '../../utils/validators';
import './Auth.scss';

type LocationState = { [s: string]: string };

const Auth: FC = props => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [disable, setDisabled] = useState(true);
    const { isLoading, sendRequest } = useFetch();
    const { csrfToken } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

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
            const data = await sendRequest({
                url: `${process.env.REACT_APP_API_URL}/users/${isLoginMode ? 'login' : 'signup'}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken,
                },
                body: isLoginMode
                    ? {
                          email: formState.inputs.email?.value,
                          password: formState.inputs.password?.value,
                      }
                    : {
                          name: formState.inputs.name?.value,
                          email: formState.inputs.email?.value,
                          password: formState.inputs.password?.value,
                          passwordConfirm: formState.inputs.passwordConfirm?.value,
                      },
                credentials: 'include',
            });
            setDisabled(true);
            dispatch(
                delayedNotification({
                    status: 'success',
                    delay: 400,
                    message: `Welcome ${data.user.name.split(' ')[0]}`,
                })
            );
            if (data.user.cart) dispatch(modifyCartData(data.user.cart, csrfToken));
            if (data.user.favorites) dispatch(modifyFavData(data.user.favorites, csrfToken));

            if (
                location.state &&
                (location.state as LocationState).from &&
                (location.state as LocationState).from !== '/auth'
            ) {
                navigate((location.state as LocationState).from, {
                    replace: true,
                });
            } else {
                navigate('/', { replace: true });
            }
            await sleep(200);

            dispatch(authActions.loggingIn(data.user));
        } catch (err) {
            dispatch(
                uiActions.showNotification({
                    status: 'error',
                    message: err instanceof Error ? err.message : 'Something went wrong',
                })
            );
        }
    };

    useEffect(() => {
        setDisabled(!formState.isValid);
    }, [formState.isValid]);

    return (
        <section className="auth">
            <div className="auth-container">
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
                    <div className="auth-btn">
                        <Button
                            role="submit"
                            style={{ transform: 'scale(1.2)' }}
                            disabled={disable}
                        >
                            {isLoading && <CircleNotch className="auth-form--load" />}
                            {!isLoading && `${isLoginMode ? 'LOGIN' : 'SIGNUP'}`}
                        </Button>
                    </div>
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

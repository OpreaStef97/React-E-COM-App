import { FC, useState, useId, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "../../../components/form";
import { Button } from "../../../components/ui-components";
import { useFetch, useForm } from "../../../hooks";
import { AuthType, authActions } from "../../../store/auth";
import { modifyCartData } from "../../../store/cart";
import { modifyFavData } from "../../../store/favorites";
import { delayedNotification, uiActions } from "../../../store/ui";
import sleep from "../../../utils/sleep";
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MAXLENGTH,
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
} from "../../../utils/validators";
import "./AuthForm.scss";

type LocationState = { [s: string]: string };

const AuthForm: FC = (props) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [disable, setDisabled] = useState(true);
    const { isLoading, sendRequest } = useFetch();
    const { csrfToken } = useSelector((state: { auth: AuthType }) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const idName = useId();
    const idEmail = useId();
    const idPassword = useId();
    const idConfirmPassword = useId();

    const [formState, inputHandler, setFormData] = useForm(
        {
            [idEmail]: {
                value: "",
                isValid: false,
            },
            [idPassword]: {
                value: "",
                isValid: false,
            },
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLoginMode) {
            const formStateObj = { ...formState.inputs };
            delete formStateObj[idName];
            delete formStateObj[idConfirmPassword];
            setFormData(
                formStateObj,
                !!formState.inputs[idEmail]?.isValid && !!formState.inputs[idPassword]?.isValid
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    [idName]: {
                        value: "",
                        isValid: false,
                    },
                    [idConfirmPassword]: {
                        value: "",
                        isValid: false,
                    },
                },
                false
            );
        }
        setIsLoginMode((prevMode) => !prevMode);
    };

    const authSubmitHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const data = await sendRequest({
                url: `${process.env.REACT_APP_API_URL}/users/${isLoginMode ? "login" : "signup"}`,
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-csrf-token": csrfToken,
                },
                body: {
                    email: formState.inputs[idEmail]?.value,
                    password: formState.inputs[idPassword]?.value,
                    ...(!isLoginMode
                        ? {
                              name: formState.inputs[idName]?.value,
                              passwordConfirm: formState.inputs[idConfirmPassword]?.value,
                          }
                        : {}),
                },
                credentials: "include",
            });
            setDisabled(true);
            dispatch(
                delayedNotification({
                    status: "success",
                    delay: 400,
                    message: `Welcome ${data.user.name.split(" ")[0]}`,
                })
            );
            if (data.user.cart) dispatch(modifyCartData(data.user.cart, csrfToken));
            if (data.user.favorites) dispatch(modifyFavData(data.user.favorites, csrfToken));

            if (
                location.state &&
                (location.state as LocationState).from &&
                (location.state as LocationState).from !== "/auth"
            ) {
                navigate((location.state as LocationState).from, {
                    replace: true,
                });
            } else {
                navigate("/", { replace: true });
            }
            await sleep(200);

            dispatch(authActions.loggingIn(data.user));
        } catch (err) {
            dispatch(
                uiActions.showNotification({
                    status: "error",
                    message: err instanceof Error ? err.message : "Something went wrong",
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
                <h2>{isLoginMode ? "Authenticate" : "Create an account"}</h2>
                <div className="separator" style={{ backgroundColor: "#063e46" }}></div>
                <form className="auth-form" onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            element="input"
                            id={idName}
                            type="text"
                            label="Name:"
                            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MAXLENGTH(15)]}
                            errorText="Please enter a name"
                            onInput={inputHandler}
                        />
                    )}
                    <Input
                        id={idEmail}
                        element="input"
                        type="email"
                        label="Email:"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter valid email"
                        onInput={inputHandler}
                    />
                    <Input
                        id={idPassword}
                        element="input"
                        type="password"
                        label="Password:"
                        validators={[VALIDATOR_MINLENGTH(8)]}
                        errorText="Please enter a password with at least 8 characters"
                        onInput={inputHandler}
                    />
                    {!isLoginMode && (
                        <Input
                            id={idConfirmPassword}
                            element="input"
                            type="password"
                            label="Password Confirm:"
                            validators={[VALIDATOR_MINLENGTH(8)]}
                            errorText="Please enter a password with at least 8 characters"
                            onInput={inputHandler}
                        />
                    )}
                    <div>
                        <Button
                            role="submit"
                            style={{ transform: "scale(1.2)" }}
                            disabled={disable}
                            loading={isLoading}
                        >
                            {`${isLoginMode ? "LOGIN" : "SIGNUP"}`}
                        </Button>
                    </div>
                </form>
                <div className="separator" style={{ backgroundColor: "#063e46" }}></div>
                {isLoginMode && (
                    <p className="auth-paragraph">New to ReactECOM? Create an account now &darr;</p>
                )}
                <Button
                    className="auth-btn"
                    role="button"
                    inverse
                    style={{ width: "18rem" }}
                    onClick={switchModeHandler}
                >
                    SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
                </Button>
            </div>
        </section>
    );
};

export default AuthForm;

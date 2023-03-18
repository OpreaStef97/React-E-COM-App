import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthType, setCSRFToken, authActions } from "../store/auth";
import { modifyCartData, cartActions, replaceLocalCart } from "../store/cart";
import { modifyFavData, replaceLocalFav } from "../store/favorites";
import { useFetch } from "./use-fetch";

export const useAppInitialisation = () => {
    const dispatch = useDispatch();
    const {
        auth: { csrfToken },
    } = useSelector((state: { auth: AuthType }) => state);

    const { sendRequest } = useFetch();

    useEffect(() => {
        dispatch(setCSRFToken());
    }, [dispatch, sendRequest]);

    useEffect(() => {
        if (!csrfToken) {
            return;
        }
        const redirectStatus = new URLSearchParams(window.location.search).get("redirect_status");
        sendRequest({
            url: `${process.env.REACT_APP_API_URL}/users/is-logged-in`,
            method: "POST",
            headers: {
                "x-csrf-token": csrfToken,
            },
            credentials: "include",
        })
            .then((data) => {
                dispatch(authActions.loggingIn(data.user));
                dispatch(modifyFavData(data.user.favorites, csrfToken));

                if (redirectStatus !== "succeeded") {
                    dispatch(modifyCartData(data.user.cart, csrfToken));
                } else {
                    dispatch(cartActions.reinitializeCart());
                }
            })
            .catch((err) => {
                dispatch(replaceLocalCart());
                dispatch(replaceLocalFav());
            });
    }, [sendRequest, csrfToken, dispatch]);
};

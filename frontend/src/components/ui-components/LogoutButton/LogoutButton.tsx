import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthType, logout } from "../../../store/auth";
import { CartType, sendCartData } from "../../../store/cart";
import { FavoritesType, sendFavData } from "../../../store/favorites";
import Button from "../Button";

import "./LogoutButton.scss";

const LogoutButton: FC<{ onClick?: () => void; style?: { [key: string]: string } }> = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const { cart, auth, favorites } = useSelector(
        (state: { auth: AuthType; cart: CartType; favorites: FavoritesType }) => state
    );

    const logoutHandler = async () => {
        setIsLoading(true);
        await Promise.all([
            dispatch(sendCartData(cart, auth.csrfToken)),
            dispatch(sendFavData(favorites, auth.csrfToken)),
        ]);

        await Promise.resolve(dispatch(logout()));
        setIsLoading(false);
        props.onClick && props.onClick();

        navigate("/auth", {
            state: { from: location.pathname },
        });
    };

    return (
        <Button
            loading={isLoading}
            onClick={logoutHandler}
            style={props.style}
        >
            LOGOUT
        </Button>
    );
};

export default LogoutButton;

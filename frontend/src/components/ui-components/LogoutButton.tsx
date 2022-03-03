import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth-actions';
import { sendCartData } from '../../store/cart-actions';
import { sendFavData } from '../../store/fav-actions';
import sleep from '../../utils/sleep';
import Button from './Button';

const LogoutButton: FC<{ onClick?: () => void; style?: { [key: string]: string } }> = props => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, auth, favorites } = useSelector((state: any) => state);

    const logoutHandler = async () => {
        dispatch(sendCartData(cart, auth.csrfToken));
        dispatch(sendFavData(favorites, auth.csrfToken));
        dispatch(logout());
        props.onClick && props.onClick();
        await sleep(500);
        navigate('/auth', {
            state: { from: location.pathname },
        });
    };

    return (
        <Button onClick={logoutHandler} style={props.style}>
            LOGOUT
        </Button>
    );
};

export default LogoutButton;

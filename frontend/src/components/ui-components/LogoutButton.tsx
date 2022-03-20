import { CircleNotch } from 'phosphor-react';
import { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../../store/auth-actions';
import { sendCartData } from '../../store/cart-actions';
import { sendFavData } from '../../store/fav-actions';
import Button from './Button';
import './LogoutButton.scss';

const LogoutButton: FC<{ onClick?: () => void; style?: { [key: string]: string } }> = props => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const { cart, auth, favorites } = useSelector((state: any) => state);

    const logoutHandler = async () => {
        setIsLoading(true);
        await Promise.all([
            dispatch(sendCartData(cart, auth.csrfToken)),
            dispatch(sendFavData(favorites, auth.csrfToken)),
        ]);

        await Promise.resolve(dispatch(logout()));
        setIsLoading(false);
        props.onClick && props.onClick();

        navigate('/auth', {
            state: { from: location.pathname },
        });
    };

    return (
        <Button className="logout-btn" onClick={logoutHandler} style={props.style}>
            {isLoading && <CircleNotch className="load" />}
            {!isLoading && 'LOGOUT'}
        </Button>
    );
};

export default LogoutButton;

import { ShoppingCart } from 'phosphor-react';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import './CartButton.scss';

const CartButton: FC<{ className?: string }> = props => {
    const { cart } = useSelector((state: any) => state);
    const navigate = useNavigate();

    return (
        <div className={`cart-button-cotainer ${props.className}`}>
            <Button
                className="cart-button"
                link
                to="/cart"
                icon={<ShoppingCart className="cart-icon" />}
                iconAfter
            >
                CART
            </Button>
            {cart.totalQuantity > 0 && (
                <span
                    onClick={() => navigate('/cart')}
                    key={cart.totalQuantity}
                    className="cart-counter"
                >
                    {cart.totalQuantity}
                </span>
            )}
        </div>
    );
};

export default CartButton;

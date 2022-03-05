import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../hooks/use-fetch';
import LoadingSpinner from '../ui-components/LoadingSpinner';
import './MePurchases.scss';

const PurchaseItem = (props: { purchase: any }) => {
    const { purchase } = props;
    const navigate = useNavigate();

    return (
        <li className="me-purchases__item">
            <h3>Products:</h3>
            <ul className="me-purchases__product--list">
                {purchase.products.map((item: any, i: number) => {
                    return (
                        <li key={i} className="me-purchases__product--item">
                            <img
                                onClick={() =>
                                    navigate(`/product/${item.product.slug}/${item.product.id}`)
                                }
                                src={`${process.env.REACT_APP_RESOURCES_URL}/products/${item.product?.images[0]}`}
                                alt={item.product.name}
                            />
                            <div className="me-purchases__product--info-box">
                                <h4>Product: {item.product.name}</h4>
                                <span>Quantity: {item.quantity}</span>
                                <span>Price: {`$${item.product.price}`} </span>
                            </div>
                        </li>
                    );
                })}
                <li className="me-purchases__product--item me-purchases__product--price">
                    <div className="me-purchases__product--info-box">
                        <span>Paid at: {new Date(purchase.paidAt).toLocaleString()}</span>
                        <span>
                            <strong>
                                Total Amount: {`$${(purchase.totalAmount / 100).toFixed(2)}`}
                            </strong>{' '}
                        </span>
                    </div>
                </li>
            </ul>
        </li>
    );
};

const MePurchases: FC = () => {
    const [purchases, setPurchases] = useState([]);
    const { auth } = useSelector((state: any) => state);
    const { isLoading, sendRequest } = useFetch();

    useEffect(() => {
        if(!auth.isLoggedIn) {
            return;
        }
        sendRequest({
            url: `${process.env.REACT_APP_API_URL}/payments/${auth.user.id}`,
            credentials: 'include',
        }).then(data => {
            setPurchases(data.docs);
        });
    }, [auth.isLoggedIn, auth.user.id, sendRequest]);

    return (
        <div className="me-purchases">
            <ul className="me-purchases__list">
                {purchases.map((item: any, i: number) => {
                    return <PurchaseItem purchase={item} key={i} />;
                })}
                {!isLoading && purchases.length === 0 && (
                    <li className="me-purchases__item--empty">
                        <p>You do not have any purchase yet</p>
                    </li>
                )}
                {isLoading && (
                    <li className="me-purchases__item--empty">
                        <LoadingSpinner />
                    </li>
                )}
            </ul>
        </div>
    );
};
export default MePurchases;

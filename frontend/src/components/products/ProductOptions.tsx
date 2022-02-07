import { FC } from 'react';
import './ProductOptions.scss';

const ProductOptions: FC<{ label?: string; items: string[] }> = props => {
    return (
        <div className="product-options">
            <p>{props.label}</p>
            <ul className="product-options-list">
                {props.items.map((item, i) => (
                    <li key={i}>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductOptions;

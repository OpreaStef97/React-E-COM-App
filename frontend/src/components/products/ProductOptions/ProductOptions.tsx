import { FC } from 'react';
import './ProductOptions.scss';

const ProductOptions: FC<{ label?: string; items: string[]; active?: string }> = props => {
    return (
        <div className="product-options">
            <p>{props.label}</p>
            <ul className="product-options-list">
                {props.items.map((item, i) => (
                    <li className={item === props.active ? 'active' : ''} key={i}>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductOptions;

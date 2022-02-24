import { FC } from 'react';
import ProductItem from './ProductItem';
import './ProductsGrid.scss';

const ProductsGrid: FC<{ sorting?: string; items: any[] }> = props => {
    const { items } = props;

    return (
        <ul className="products__grid fade" key={items.length}>
            {items.length > 0 &&
                items.map((item, idx) => {
                    return (
                        <ProductItem
                            product={item}
                            key={idx}
                            className="products__item"
                            numberOfShownCards={1}
                            idx={idx}
                        />
                    );
                })}
            {items.length === 0 && (
                <p className="products__grid--no-items">
                    Uh oh...😶 <br />
                    No item match the selected options <br />
                    Try different options 🤷‍♂️
                </p>
            )}
        </ul>
    );
};

export default ProductsGrid;

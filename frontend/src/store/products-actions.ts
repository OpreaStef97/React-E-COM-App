import { productsActions } from './products-slice';

export const fetchProducts = (category?: string) => {
    return async (dispatch: any) => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/products${category ? `?category=${category}` : ''}`
            );

            if (!res.ok) {
                throw new Error('Could not fetch product data!');
            }

            const data = await res.json();

            dispatch(productsActions.setProducts([...data.products]));
        } catch (err) {
            console.error(err);
        }
    };
};

export const fetchValues = (fields: string, category: string) => {
    return async (dispatch: any) => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/products/values?fields=${fields}${
                    category === 'All' ? '' : `&category=${category}`
                }`
            );

            if (!res.ok) {
                throw new Error('Could not fetch values!');
            }

            const data = await res.json();

            dispatch(productsActions.setValues(data[category]));
        } catch (err) {
            console.error(err);
        }
    };
};

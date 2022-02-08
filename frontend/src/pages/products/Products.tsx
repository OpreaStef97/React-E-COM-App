import { FC, Fragment, useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MenuSelect from '../../components/form/MenuSelect';
import ProductList from '../../components/products/ProductList';
import ProductsGrid from '../../components/products/ProductsGrid';
import ProductsSideBar from '../../components/products/ProductsSideBar';
import SectionTitle from '../../components/ui-components/SectionTitle';
import useFilter from '../../hooks/use-filter';
import useSetOptions from '../../hooks/use-set-options';
import useSort from '../../hooks/use-sort';
import { useTitle } from '../../hooks/use-title';
import { fetchProducts } from '../../store/products-actions';
import { selectReducer, SelectState } from '../../utils/reducers';
import './Products.scss';

const convertData = (products: any) => {
    return products.map((product: any) => {
        return {
            name: product.name,
            image: `http://localhost:5000/images/products//${product.images[0]}`,
            price: product.price,
            brand: product.brand,
            RAM: product.default.RAM,
            storage: product.default.storage,
            type: [...product.type],
            id: product.id,
            slug: product.slug,
        };
    });
};

const Products: FC<{ category?: string; options?: any }> = props => {
    useTitle(`ReactCOM | ${(props.category && `${props.category}s`) || 'All Products'}`);
    const [items, setItems] = useState<{ name: string; image: string; price: number }[]>([]);
    const [initialItems, setInitialItems] = useState<
        { name: string; image: string; price: number }[]
    >([]);
    const [options, setOptions] = useState<SelectState>({});
    const [selectState, dispatch] = useReducer(selectReducer, {});
    const [sorting, setSorting] = useState<string>();

    const { products } = useSelector((state: any) => state.products);
    const reduxDispatch = useDispatch();

    const { category } = props;

    useEffect(() => {
        reduxDispatch(fetchProducts(category || ''));
    }, [category, reduxDispatch]);

    useSetOptions(setOptions, props.category || 'All');

    useEffect(() => {
        dispatch({
            type: 'SET_DATA',
            payload: options,
        });
    }, [options]);

    useEffect(() => {
        if (products.length > 0) setInitialItems([...convertData(products)]);
    }, [products]);

    useEffect(() => {
        if (initialItems.length > 0) setItems([...initialItems]);
    }, [initialItems]);

    useSort(selectState, setSorting, setItems, initialItems);

    const selectHandler = (id: string, value: string, uniqueSelect: boolean) => {
        dispatch({
            type: 'SELECT',
            uniqueSelect,
            value,
            id,
        });
    };
    const deleteHandler = (id?: string) => {
        dispatch({
            type: 'DELETE',
            id,
        });
        setItems([...initialItems]);
    };

    // Filter by brand
    useFilter(selectState, 'brand', setItems);

    // Filter by type
    useFilter(selectState, 'type', setItems);

    // Filter by RAM
    useFilter(selectState, 'RAM', setItems);

    // Filter by Storage
    useFilter(selectState, 'storage', setItems);

    return (
        <>
            <section className="products">
                <div className="products__container">
                    <div className="products__filter-bar">
                        <div className="products__filter-bar--info">
                            <h4 className="products__filter-bar--title">
                                {(props.category && `${props.category}s`) || 'All Products'}
                            </h4>
                            <p className="products__filter-bar--results">{`${items.length} results`}</p>
                        </div>
                        <div className="separator"></div>
                        <div className="products__filter-bar--select">
                            {Object.keys(selectState).length > 0 &&
                                Object.keys(selectState).map(key => {
                                    if (selectState[key].options.length > 0)
                                        return (
                                            <MenuSelect
                                                id={key}
                                                key={key}
                                                uniqueSelect={key === 'sort'}
                                                onSelect={selectHandler}
                                                onDelete={deleteHandler}
                                                options={selectState[key]}
                                                placeholder={`${key}..`}
                                                label={`Select ${
                                                    key.charAt(0).toUpperCase() + key.slice(1)
                                                }: `}
                                            />
                                        );
                                    return <Fragment key={key}></Fragment>;
                                })}
                        </div>
                    </div>
                    <ProductsSideBar className="products__container--side-bar" />
                    <ProductsGrid key={props.category} sorting={sorting} items={items} />
                </div>
                <SectionTitle>Others are interested in these..</SectionTitle>
                <ProductList category="Laptop" />
            </section>
        </>
    );
};

export default Products;

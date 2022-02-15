import { FC, Fragment, useEffect, useState } from 'react';
import MenuSelect from '../../components/form/MenuSelect';
import ProductList from '../../components/products/ProductList';
import ProductsGrid from '../../components/products/ProductsGrid';
import ProductsSideBar from '../../components/products/ProductsSideBar';
import LoadingSpinner from '../../components/ui-components/LoadingSpinner';
import Pagination from '../../components/ui-components/Pagination';
import SectionTitle from '../../components/ui-components/SectionTitle';
import useConvertData from '../../hooks/use-convert-data';
import useFetch from '../../hooks/use-fetch';
import useFilter from '../../hooks/use-filter';
import useSelect from '../../hooks/use-select';
import useSetOptions from '../../hooks/use-set-options';
import useSort from '../../hooks/use-sort';
import { useTitle } from '../../hooks/use-title';
import './Products.scss';

const Products: FC<{ category?: string; options?: any }> = props => {
    const { category } = props;
    const [items, setItems] = useState<any>([]);
    const [initialItems, setInitialItems] = useState<any>([]);
    const [sorting, setSorting] = useState<string>();

    const { isLoading, sendRequest } = useFetch();
    useTitle(`ReactCOM | ${(props.category && `${props.category}s`) || 'All Products'}`);
    const { selectState, selectHandler, deleteHandler, setHandler } = useSelect();
    const convertData = useConvertData();
    const options = useSetOptions(category || 'All');
    const [requestString, setRequestString] = useState('');

    useEffect(() => {
        if (!requestString) return;
        sendRequest(
            `${process.env.REACT_APP_API_URL}/products?${'sort=price'}${
                category !== 'All' ? `&category=${category}` : ''
            }&page=1&limit=${requestString}`
        )
            .then(data => {
                setInitialItems(convertData([...data.docs]));
            })
            .catch(console.error);
        return () => setInitialItems([]);
    }, [category, sendRequest, convertData, requestString]);

    useEffect(() => {
        setHandler(options);
    }, [options, setHandler]);

    useEffect(() => {
        if (initialItems.length > 0) setItems([...initialItems]);
    }, [initialItems]);

    useEffect(() => {
        if (!selectState || !selectState['show']) {
            return;
        }
        const { selected, options } = selectState['show'];
        const idx = selected.findIndex((val: boolean) => val === true);
        if (idx !== -1) {
            setRequestString(`${options[idx].split('/')[0]}`);
        }
    }, [selectState]);

    useSort(selectState, setSorting, setItems, initialItems);
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
                            <h2 className="products__filter-bar--title">
                                {props.category === 'All' ? 'All Products' : props.category}
                            </h2>
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
                                                onlySelect={key === 'show'}
                                                uniqueSelect={key === 'sort'}
                                                onSelect={selectHandler}
                                                onDelete={deleteHandler}
                                                options={selectState[key]}
                                                placeholder={`${key}..`}
                                                label={
                                                    key === 'show'
                                                        ? 'Show items per page:'
                                                        : `Select ${
                                                              key.charAt(0).toUpperCase() +
                                                              key.slice(1)
                                                          }: `
                                                }
                                            />
                                        );
                                    return <Fragment key={key}></Fragment>;
                                })}
                        </div>
                    </div>
                    <ProductsSideBar className="products__container--side-bar" />
                    <div className="products__container-page">
                        <Pagination />
                        {isLoading && (
                            <div className="products__container--loader">
                                <LoadingSpinner />
                            </div>
                        )}
                        {!isLoading && (
                            <ProductsGrid key={props.category} sorting={sorting} items={items} />
                        )}
                        <Pagination className="margin-top" />
                    </div>
                </div>
                <SectionTitle>Others are interested in these..</SectionTitle>
                <ProductList category="Laptop" />
            </section>
        </>
    );
};

export default Products;

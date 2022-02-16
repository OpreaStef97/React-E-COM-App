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
import useLimit from '../../hooks/use-limit';
import useRequestFilter from '../../hooks/use-request-filter';
import useRequestSort from '../../hooks/use-request-sort';
import useSelect from '../../hooks/use-select';
import useSetOptions from '../../hooks/use-set-options';
import { useTitle } from '../../hooks/use-title';
import './Products.scss';

const Products: FC<{ category?: string; options?: any }> = props => {
    const { category } = props;
    const [items, setItems] = useState<any>([]);
    const { isLoading, sendRequest } = useFetch();
    useTitle(`ReactCOM | ${(props.category && `${props.category}s`) || 'All Products'}`);
    const convertData = useConvertData();
    const options = useSetOptions(category || 'All');
    const { selectState, selectHandler, deleteHandler, setHandler } = useSelect();
    const [totalSize, setTotalSize] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);

    const sorting = useRequestSort(selectState);
    const filter = useRequestFilter(selectState);
    const limit = useLimit(selectState);

    useEffect(() => {
        if (limit || filter) setPageNumber(1);
    }, [limit, filter]);

    useEffect(() => {
        setHandler(options);
    }, [options, setHandler]);

    useEffect(() => {
        if (!limit) return;

        sendRequest(
            `${process.env.REACT_APP_API_URL}/products?&sort=${sorting}${
                category !== 'All' ? `&category=${category}` : ''
            }${filter}&page=${pageNumber}&limit=${limit}`
        )
            .then(data => {
                setTotalSize(data.totalLength);
                setItems(convertData([...data.docs]));
            })
            .catch(console.error);
        return () => setItems([]);
    }, [category, sendRequest, convertData, limit, pageNumber, sorting, filter]);

    return (
        <>
            <section className="products">
                <div className="products__container">
                    <div className="products__filter-bar">
                        <div className="products__filter-bar--info">
                            <h2 className="products__filter-bar--title">
                                {props.category === 'All' ? 'All Products' : `${props.category}s`}
                            </h2>
                            <p className="products__filter-bar--results">{`${totalSize} results`}</p>
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
                                                        ? 'No. of items/page:'
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
                        <Pagination
                            onPageChange={page => setPageNumber(page)}
                            totalSize={totalSize}
                            pageNumber={pageNumber}
                            pageSize={+limit}
                        />
                        {isLoading && (
                            <div className="products__container--loader">
                                <p>Loading...</p>
                                <LoadingSpinner/>
                            </div>
                        )}
                        {!isLoading && (
                            <ProductsGrid key={props.category} sorting={sorting} items={items} />
                        )}
                        <Pagination
                            className="margin-top"
                            onPageChange={page => setPageNumber(page)}
                            totalSize={totalSize}
                            pageNumber={pageNumber}
                            pageSize={+limit}
                        />
                    </div>
                </div>
                <SectionTitle>Others are interested in these..</SectionTitle>
                <ProductList category="Laptop" />
            </section>
        </>
    );
};

export default Products;

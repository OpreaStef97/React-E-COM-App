import { FC, useState, useEffect, useCallback, Fragment } from "react";
import { useSwipeable } from "react-swipeable";
import { MenuSelect } from "../../../components/form";
import ProductsGrid from "../../../components/products/ProductsGrid";
import ProductsSideBar from "../../../components/products/ProductsSideBar";
import { HorizontalScroll, Pagination, LoadingSpinner } from "../../../components/ui-components";
import {
    useFetch,
    useTitle,
    useConvertData,
    useSelect,
    useSetOptions,
    useRequestSort,
    useRequestFilter,
    useLimit,
    useWindow,
    useSmoothScroll,
} from "../../../hooks";
import "./Products.scss";

const Products: FC<{ category?: string }> = (props) => {
    const { category } = props;
    const [items, setItems] = useState([]);
    const { isLoading, sendRequest } = useFetch();
    useTitle(`ReactECOM | ${props.category === "All" ? "All Products" : `${props.category}s`}`);
    const convertData = useConvertData();
    const { selectState, selectHandler, deleteHandler, setHandler } = useSelect();
    const [totalSize, setTotalSize] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);

    const options = useSetOptions(category || "All");
    const sorting = useRequestSort(selectState);
    const filter = useRequestFilter(selectState);
    const limit = useLimit(selectState);
    const [width] = useWindow();
    const [firstCall, setFirstCall] = useState(true);

    useEffect(() => {
        setPageNumber(1);
    }, [limit, filter]);

    useEffect(() => {
        setHandler(options);
    }, [options, setHandler]);

    useEffect(() => {
        if (!limit) return;

        sendRequest({
            url: `${process.env.REACT_APP_API_URL}/products?&sort=${sorting}${
                category !== "All" ? `&category=${category}` : ""
            }${filter}&page=${pageNumber}&limit=${limit}`,
        })
            .then((data) => {
                setTotalSize(data.totalLength);
                setItems(convertData([...data.docs]));
            })
            .catch(console.error)
            .finally(() => setFirstCall(false));
        return () => setItems([]);
    }, [category, sendRequest, convertData, limit, pageNumber, sorting, filter]);

    const smoothScroll = useSmoothScroll();

    const nextHandler = useCallback(() => {
        if (pageNumber < Math.ceil(totalSize / +limit)) {
            setPageNumber(pageNumber + 1);
        }
    }, [limit, pageNumber, totalSize]);

    const prevHandler = useCallback(() => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    }, [pageNumber]);

    const [show, setShow] = useState(false);

    const pageChangeHandler = useCallback((p: number) => {
        setPageNumber(p);
    }, []);
    const handlers = useSwipeable({
        onSwipedLeft: () => {
            nextHandler();
            if (pageNumber < Math.ceil(totalSize / +limit)) window.scrollTo(0, 0);
        },
        onSwipedRight: () => {
            prevHandler();
            if (pageNumber > 1) window.scrollTo(0, 0);
        },
    });

    const showSwipeHandler = useSwipeable({
        onSwipedLeft: (e) => {
            const { target } = e.event;
            if (!(target instanceof HTMLSpanElement) && !(target instanceof HTMLLIElement)) {
                setShow(true);
                setShow(false);
            }
        },
        onSwipedRight: (e) => {
            const { target } = e.event;
            if (!(target instanceof HTMLSpanElement) && !(target instanceof HTMLLIElement)) {
                setShow(true);
                setShow(false);
            }
        },
    });

    const [horizontal, setHorizontal] = useState(false);

    return (
        <section className="products">
            <div className="products__container">
                <div className="products__filter-bar">
                    <div className="products__filter-bar--info">
                        <h2 className="products__filter-bar--title">
                            {props.category === "All" ? "All Products" : `${props.category}s`}
                        </h2>
                        <p className="products__filter-bar--results">{`${totalSize} results`}</p>
                    </div>
                    <div className="separator" />
                    <div className="products__filter-bar--select">
                        {Object.keys(selectState).length > 0 && (
                            <>
                                {width > 643 &&
                                    Object.keys(selectState).map((key) => {
                                        if (selectState[key].options.length > 0)
                                            return (
                                                <MenuSelect
                                                    id={key}
                                                    key={key}
                                                    onlySelect={key === "show"}
                                                    uniqueSelect={key === "sort"}
                                                    onSelect={selectHandler}
                                                    onDelete={deleteHandler}
                                                    options={selectState[key]}
                                                    placeholder={`${
                                                        key.charAt(0).toUpperCase() + key.slice(1)
                                                    }..`}
                                                    label={
                                                        key === "show"
                                                            ? "No. of items/page:"
                                                            : `Select ${
                                                                  key.charAt(0).toUpperCase() +
                                                                  key.slice(1)
                                                              }: `
                                                    }
                                                />
                                            );
                                        return <Fragment key={key}></Fragment>;
                                    })}
                                {width <= 643 && (
                                    <HorizontalScroll
                                        handlers={showSwipeHandler}
                                        overflow={horizontal}
                                    >
                                        {Object.keys(selectState).map((key) => {
                                            if (selectState[key].options.length > 0)
                                                return (
                                                    <MenuSelect
                                                        id={key}
                                                        key={key}
                                                        show={show}
                                                        onlySelect={key === "show"}
                                                        uniqueSelect={key === "sort"}
                                                        className="products__filter-bar--item"
                                                        onSelect={selectHandler}
                                                        onClick={setHorizontal}
                                                        onDelete={deleteHandler}
                                                        options={selectState[key]}
                                                        placeholder={`${
                                                            key.charAt(0).toUpperCase() +
                                                            key.slice(1)
                                                        }..`}
                                                        label={
                                                            key === "show"
                                                                ? "No. of items/page:"
                                                                : `Select ${
                                                                      key.charAt(0).toUpperCase() +
                                                                      key.slice(1)
                                                                  }: `
                                                        }
                                                    />
                                                );
                                            return <Fragment key={key} />;
                                        })}
                                    </HorizontalScroll>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <ProductsSideBar className="products__container--side-bar" />
                <div className="products__container-page" {...handlers}>
                    <Pagination
                        onNext={nextHandler}
                        onPrev={prevHandler}
                        onChange={pageChangeHandler}
                        totalSize={totalSize}
                        pageNumber={pageNumber}
                        pageSize={+limit}
                    />
                    {(firstCall || isLoading) && (
                        <div className="products__container--loader">
                            {firstCall && <LoadingSpinner />}
                        </div>
                    )}
                    {!firstCall && !isLoading && (
                        <ProductsGrid key={props.category} items={items} />
                    )}
                    <Pagination
                        className="margin-top"
                        onNext={async () => {
                            await smoothScroll();
                            return nextHandler();
                        }}
                        onPrev={async () => {
                            await smoothScroll();
                            return prevHandler();
                        }}
                        onChange={async (page: number) => {
                            await smoothScroll();
                            return pageChangeHandler(page);
                        }}
                        totalSize={totalSize}
                        pageNumber={pageNumber}
                        pageSize={+limit}
                    />
                </div>
            </div>
            {/* <HorizontalScroll /> */}
        </section>
    );
};

export default Products;

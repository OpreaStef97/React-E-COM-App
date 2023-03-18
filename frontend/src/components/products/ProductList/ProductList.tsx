import { FC, useState, useEffect, useCallback } from "react";
import { useSwipeable } from "react-swipeable";
import { useShowCards, useFetch, usePrevious } from "../../../hooks";
import { ListButton, LoadingSpinner } from "../../ui-components";
import ProductItem from "../ProductItem";
import "./ProductList.scss";

const ProductList: FC<{ category?: string; exclude?: string }> = (props) => {
    const [index, setIndex] = useState(0);
    const [allDataLoaded, setAllDataLoaded] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [max, setMax] = useState<number>(-1);

    const numberOfShownCards = useShowCards();

    const { category, exclude } = props;
    const { isLoading, sendRequest } = useFetch();
    const prevNumberOfShownCards = usePrevious(numberOfShownCards);

    // when window size is changed
    useEffect(() => {
        if (prevNumberOfShownCards !== numberOfShownCards) {
            setAllDataLoaded(false);
            setPage(1);
            setMax(-1);
            setIndex(0);
        }
    }, [prevNumberOfShownCards, numberOfShownCards]);

    const [firstCall, setFirstCall] = useState(false);
    // first request
    useEffect(() => {
        if (!numberOfShownCards) {
            return;
        }
        setFirstCall(true);
        sendRequest({
            url: `${process.env.REACT_APP_API_URL}/products?page=1&limit=${
                numberOfShownCards < 3 ? 20 : numberOfShownCards
            }${category ? `&category=${category}` : ""}${exclude ? `&_id[ne]=${exclude}` : ""}`,
        })
            .then((data) => {
                if (data.results > 0) setProducts([...data.docs]);
            })
            .catch(console.error)
            .finally(() => setFirstCall(false));

        return () => {
            setProducts([]);
        };
    }, [sendRequest, category, numberOfShownCards, exclude]);

    const sendRequestHandler = useCallback(
        async (limit: number) => {
            try {
                const data = await sendRequest({
                    url: `${process.env.REACT_APP_API_URL}/products?page=${
                        page + 1
                    }&limit=${limit}${category ? `&category=${category}` : ""}`,
                });
                if (data.results > 0) {
                    setProducts((prevProducts) => {
                        prevProducts.push(...data.docs);
                        return prevProducts;
                    });
                    setPage((page) => ++page);
                    setIndex((prevIdx) => ++prevIdx);
                } else {
                    setMax(index);
                    setAllDataLoaded(true);
                }
            } catch (message) {
                return console.error(message);
            }
        },
        [category, index, page, sendRequest]
    );

    const moveRightHandler = () => {
        if (!numberOfShownCards) {
            return;
        }
        if (!allDataLoaded && numberOfShownCards >= 3 && page === index + 1) {
            sendRequestHandler(numberOfShownCards);
        }
        if (index < products.length / numberOfShownCards - 1) {
            setIndex((prevIdx) => ++prevIdx);
        }
    };

    const moveLeftHandler = () => {
        if (index > 0) setIndex((prevIdx) => --prevIdx);
    };

    const handlers = useSwipeable({
        delta: 0,
        preventDefaultTouchmoveEvent: true,
        onSwipedLeft: () => {
            moveRightHandler();
        },
        onSwipedRight: () => {
            moveLeftHandler();
        },
    });

    return (
        <div className="product-list">
            {!firstCall && (
                <ListButton
                    in={index === 0}
                    type={"left"}
                    onClick={() => !isLoading && moveLeftHandler()}
                />
            )}
            <div className="product-list-container">
                <ul
                    className="product-list-container--list"
                    style={{
                        transform: `translateX(${-index * 100}%)`,
                    }}
                    {...handlers}
                >
                    {products.length > 0 &&
                        products.map((product: any, idx: number) => {
                            return (
                                <ProductItem
                                    product={product}
                                    key={idx}
                                    numberOfShownCards={numberOfShownCards}
                                    idx={idx}
                                />
                            );
                        })}
                    {firstCall && (
                        <li>
                            <LoadingSpinner />
                        </li>
                    )}
                </ul>
            </div>
            {!firstCall && (
                <ListButton
                    isLoading={isLoading}
                    in={
                        index ===
                        (numberOfShownCards &&
                            (numberOfShownCards >= 3
                                ? max
                                : products.length / numberOfShownCards - 1))
                    }
                    type="right"
                    onClick={() => !isLoading && moveRightHandler()}
                />
            )}
        </div>
    );
};

export default ProductList;

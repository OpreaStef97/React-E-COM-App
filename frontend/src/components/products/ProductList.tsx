import { FC, useCallback, useEffect, useState } from 'react';
import useFetch from '../../hooks/use-fetch';
import usePrevious from '../../hooks/use-previos';
import useShowCards from '../../hooks/use-show-cards';
import ListButton from './ListButton';
import ProductItem from './ProductItem';

import './ProductList.scss';

const ProductList: FC<{ category?: string; exclude?: string }> = props => {
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

    // first request
    useEffect(() => {
        if (!numberOfShownCards) {
            return;
        }
        sendRequest(
            `${process.env.REACT_APP_API_URL}/products?page=1&limit=${
                numberOfShownCards < 3 ? 4 : numberOfShownCards
            }${category ? `&category=${category}` : ''}${exclude ? `&_id[ne]=${exclude}` : ''}`
        )
            .then(data => {
                if (data.results > 0) setProducts([...data.docs]);
            })
            .catch(console.error);

        return () => {
            setProducts([]);
        };
    }, [sendRequest, category, numberOfShownCards, exclude]);

    const sendRequestHandler = useCallback(
        async (limit: number) => {
            try {
                const data = await sendRequest(
                    `${process.env.REACT_APP_API_URL}/products?page=${page + 1}&limit=${limit}${
                        category ? `&category=${category}` : ''
                    }`
                );
                if (data.results > 0) {
                    setProducts(prevProducts => {
                        prevProducts.push(...data.docs);
                        return prevProducts;
                    });
                    setPage(page => ++page);
                    setIndex(prevIdx => ++prevIdx);
                } else {
                    setAllDataLoaded(true);
                    setMax(index);
                }
            } catch (message) {
                return console.error(message);
            }
        },
        [category, page, sendRequest, index]
    );

    const moveRightHandler = () => {
        if (!numberOfShownCards) {
            return;
        }
        if (!allDataLoaded) {
            if (numberOfShownCards >= 3 && page === index + 1)
                sendRequestHandler(numberOfShownCards);

            // to not send a request at every 2 cards
            if (numberOfShownCards === 2 && (index + 1) % 2 === 0 && (index + 1) / 2 === page)
                sendRequestHandler(4);

            // to not send a request at every one card
            if (numberOfShownCards === 1 && (index + 1) % 4 === 0 && (index + 1) / 4 === page)
                sendRequestHandler(4);
        }
        if (index < products.length / numberOfShownCards - 1) {
            setIndex(prevIdx => ++prevIdx);
        }
    };

    const moveLeftHandler = () => {
        if (index > 0) setIndex(prevIdx => --prevIdx);
    };

    return (
        <div className="product-list">
            <ListButton in={index === 0} type={'left'} onClick={moveLeftHandler} />
            <div className="product-list-container">
                <ul
                    className="product-list-container--list"
                    style={{
                        transform: `translateX(${-index * 100}%)`,
                    }}
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
                </ul>
            </div>
            <ListButton
                isLoading={isLoading}
                in={index === max}
                type="right"
                onClick={moveRightHandler}
            />
        </div>
    );
};

export default ProductList;

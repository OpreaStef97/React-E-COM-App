import { FC, useEffect, useState } from 'react';
import useFetch from '../../hooks/use-fetch';
import usePrevious from '../../hooks/use-previos';
import useWindowWidth from '../../hooks/use-window-width';
import ListButton from './ListButton';
import ProductItem from './ProductItem';

import './ProductList.scss';

const ProductList: FC<{ category?: string }> = props => {
    const [index, setIndex] = useState(0);
    const [numberOfShownCards, setNumberOfShownCards] = useState(3);
    const [allDataLoaded, setAllDataLoaded] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [showBtn, setShowBtn] = useState(false);

    useWindowWidth(setNumberOfShownCards, setIndex);

    const { category } = props;
    const { isLoading, sendRequest } = useFetch();
    const prevNumberOfShownCards = usePrevious(numberOfShownCards);

    // when window size is changed
    useEffect(() => {
        if (prevNumberOfShownCards !== numberOfShownCards) {
            setAllDataLoaded(false);
            setPage(1);
            setShowBtn(false);
        }
    }, [prevNumberOfShownCards, numberOfShownCards]);

    useEffect(() => {
        sendRequest(
            `http://localhost:5000/api/products?page=1&limit=${
                numberOfShownCards < 3 ? 3 : numberOfShownCards
            }${category ? `&category=${category}` : ''}`
        )
            .then(data => {
                if (data.length > 0) setProducts([...data.products]);
            })
            .catch(console.error);
    }, [sendRequest, category, numberOfShownCards]);

    const moveRightHandler = () => {
        if (!allDataLoaded && page === index + 1)
            return sendRequest(
                `http://localhost:5000/api/products?page=${page + 1}&limit=${
                    numberOfShownCards < 3 ? 3 : numberOfShownCards
                }${category ? `&category=${category}` : ''}`
            )
                .then(data => {
                    if (data.length > 0) {
                        setProducts(prevProducts => {
                            prevProducts.push(...data.products);
                            return prevProducts;
                        });
                        setPage(page => ++page);
                        setIndex(prevIdx => ++prevIdx);
                    } else {
                        setAllDataLoaded(true);
                    }
                })
                .catch(console.error);
        if (index < products.length / numberOfShownCards - 1) {
            setIndex(prevIdx => ++prevIdx);
        } else {
            setShowBtn(true);
        }
    };

    const moveLeftHandler = () => {
        if (index > 0) setIndex(prevIdx => --prevIdx);
        setShowBtn(false);
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
                                    key={idx}
                                    name={product.name}
                                    price={product.price}
                                    numberOfShownCards={numberOfShownCards}
                                    idx={idx}
                                    imgUrl={`http://localhost:5000/images/products//${product.images[0]}`}
                                    id={product.id}
                                    slug={product.slug}
                                />
                            );
                        })}
                </ul>
            </div>
            <ListButton
                isLoading={isLoading}
                in={showBtn}
                type="right"
                onClick={moveRightHandler}
            />
        </div>
    );
};

export default ProductList;

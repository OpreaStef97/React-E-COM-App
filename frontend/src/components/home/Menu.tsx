import { useState } from 'react';
import { FC, useCallback, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { DUMMY_IMAGES } from '../../utils/dummy-data';
import Offer from '../promoting/Offer';
import Dropdown from './Dropdown';
import './Menu.scss';
import TransitionSlider from '../ui-components/TransitionSlider';
import { showReducer } from '../../utils/reducers';

const Menu: FC<{ clicked?: boolean; onClear?: () => void }> = props => {
    const [showState, dispatch] = useReducer(showReducer, {
        s0: false,
        s1: false,
        s2: false,
        s3: false,
    });
    const [menuClick, setMenuClick] = useState(true);
    const [allFalse, setAllFalse] = useState(true);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    const { clicked, onClear } = props;

    const showHandler = useCallback(
        (idx?: number) => {
            dispatch({
                type: 'CHANGE',
                payload: idx,
            });
            setAllFalse(!Object.values(showState).some(val => val === true));
        },
        [showState]
    );

    const onHoverHandler = (idx: number) => {
        setIndex(idx);
    };

    // for closing the dropdown
    const menuClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        if (
            (event.target as Element).className === 'menu' ||
            (event.target as Element).className === 'menu-list'
        ) {
            setMenuClick(true);
        }
    };

    useEffect(() => {
        if (clicked || menuClick) {
            dispatch({
                type: 'CLOSE',
            });
            setAllFalse(!Object.values(showState).some(val => val === true));
            setMenuClick(false);
        }
        onClear && onClear();
    }, [showState, clicked, onClear, menuClick]);

    return (
        <>
            <div className="menu" onClick={menuClickHandler}>
                <button
                    onClick={showHandler.bind(null, 0)}
                    className={`menu__button ${showState[`s${0}`] ? 'menu__button-active' : ''}`}
                >
                    {'Products'}
                    <span className="menu__button-triangle">▲</span>
                </button>
                <button
                    onClick={showHandler.bind(null, 1)}
                    className={`menu__button ${showState[`s${1}`] ? 'menu__button-active' : ''}`}
                >
                    {'Week Offers'}
                    <span className="menu__button-triangle">▲</span>
                </button>
                {/* <button
                    onClick={showHandler.bind(null, 2)}
                    className={`menu__button ${showState[`s${2}`] ? 'menu__button-active' : ''}`}
                >
                    {'Get Premium'}
                    <span className="menu__button-triangle">▲</span>
                </button> */}
            </div>

            <div className="menu-dropdown">
                <Dropdown
                    show={showState[`s${0}`]}
                    allFalse={allFalse}
                    onHover={onHoverHandler}
                    links={[
                        { name: 'Phones', to: '/products/phones' },
                        { name: 'Laptops', to: '/products/laptops' },
                        { name: 'Tablets', to: '/products/tablets' },
                    ]}
                >
                    <TransitionSlider idx={index} transitionMs={200}>
                        {DUMMY_IMAGES.map((src, idx) => (
                            <img
                                onClick={() => navigate('/products')}
                                className="menu-image"
                                key={idx}
                                style={{
                                    cursor: 'pointer',
                                    objectFit: 'cover',
                                    height: '60vh',
                                    width: '100%',
                                    borderRadius: '1rem',
                                }}
                                src={src}
                                alt={src}
                            />
                        ))}
                    </TransitionSlider>
                </Dropdown>
                <Dropdown show={showState[`s${1}`]} allFalse={allFalse}>
                    <TransitionSlider transitionMs={100}>
                        <Offer
                            src={'../../images/iphone13Pro-promo-image.jpeg'}
                            content={'iPhone 13 Pro for just:'}
                            price={1099}
                        />
                        <Offer
                            src={'../../images/S21-Ultra-promo-image.jpeg'}
                            content={'S21 Ultra for just:'}
                            price={899}
                            light
                        />
                    </TransitionSlider>
                </Dropdown>
                {/* <Dropdown show={showState[`s${2}`]} allFalse={allFalse}></Dropdown> */}
            </div>
        </>
    );
};

export default Menu;

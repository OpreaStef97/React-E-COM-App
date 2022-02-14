import { useRef, useState } from 'react';
import { FC, useCallback, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { DUMMY_IMAGES } from '../../utils/dummy-data';
import Offer from '../promoting/Offer';
import Dropdown from './Dropdown';
import './Menu.scss';
import TransitionSlider from '../ui-components/TransitionSlider';
import { showReducer } from '../../utils/reducers';
import { Link } from 'react-router-dom';
import useClickOutside from '../../hooks/use-clicks-outside';

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

    const ref = useRef<HTMLDivElement>(null);

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

    const { clicked, clearClick } = useClickOutside(ref);

    useEffect(() => {
        if (clicked || menuClick) {
            dispatch({
                type: 'CLOSE',
            });
            setAllFalse(!Object.values(showState).some(val => val === true));
            setMenuClick(false);
        }
        clearClick();
    }, [showState, menuClick, clicked, clearClick]);

    return (
        <div ref={ref}>
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
            </div>

            <div className="menu-dropdown">
                <Dropdown show={showState[`s${0}`]} height="70vh" allFalse={allFalse} transitionMs={700}>
                    <div className="menu-dropdown-container">
                        <ul className="menu-dropdown-links">
                            <li className="menu-dropdown-links--item">
                                <Link
                                    className="menu-dropdown-link"
                                    to={'/products/phones'}
                                    onMouseEnter={onHoverHandler.bind(null, 0)}
                                >
                                    {'Phones'}
                                </Link>
                            </li>
                            <li className="menu-dropdown-links--item">
                                <Link
                                    className="menu-dropdown-link"
                                    to={'/products/laptops'}
                                    onMouseEnter={onHoverHandler.bind(null, 1)}
                                >
                                    {'Laptops'}
                                </Link>
                            </li>
                            <li className="menu-dropdown-links--item">
                                <Link
                                    className="menu-dropdown-link"
                                    to={'/products/tablets'}
                                    onMouseEnter={onHoverHandler.bind(null, 2)}
                                >
                                    {'Tablets'}
                                </Link>
                            </li>
                        </ul>
                        <TransitionSlider idx={index} transitionMs={200}>
                            {DUMMY_IMAGES.map((src, idx) => {
                                return (
                                    <img
                                        onClick={() => navigate('/products')}
                                        className="menu-image"
                                        key={idx}
                                        style={{
                                            cursor: 'pointer',
                                            objectFit: 'cover',
                                            height: '50vh',
                                            width: '70vw',
                                            borderRadius: '1rem',
                                        }}
                                        src={src}
                                        alt={src}
                                    />
                                );
                            })}
                        </TransitionSlider>
                    </div>
                </Dropdown>
                <Dropdown show={showState[`s${1}`]} allFalse={allFalse} height="70vh" transitionMs={700}>
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
            </div>
        </div>
    );
};

export default Menu;

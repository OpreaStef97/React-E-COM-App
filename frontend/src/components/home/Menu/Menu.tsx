import { DeviceMobile, Laptop, DeviceTablet, ShoppingBag } from "phosphor-react";
import { FC, useReducer, useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useClickOutside, useWindow } from "../../../hooks";
import Offer from "../../promoting/Offer";
import { Dropdown, TransitionSlider } from "../../ui-components";
import "./Menu.scss";

type ShowState = {
    [key: string]: boolean;
};
const showInitialState: ShowState = {
    s0: false,
    s1: false,
    s2: false,
    s3: false,
};

export const showReducer = (state: ShowState, action: any) => {
    switch (action.type) {
        case "CHANGE": {
            const newState = {
                ...state,
                [`s${action.payload}`]: !state[`s${action.payload}`],
            };

            Object.keys(newState).forEach((key) => {
                if (key !== `s${action.payload}`) {
                    newState[key] = false;
                }
            });

            return {
                ...newState,
            };
        }
        case "CLOSE": {
            return showInitialState;
        }
        default:
            return state;
    }
};

const Menu: FC<{ clicked?: boolean; onClear?: () => void }> = (props) => {
    const [showState, dispatch] = useReducer(showReducer, showInitialState);
    const [menuClick, setMenuClick] = useState(true);
    const [allFalse, setAllFalse] = useState(true);
    const navigate = useNavigate();

    const ref = useRef<HTMLDivElement>(null);

    const showHandler = useCallback(
        (idx?: number) => {
            dispatch({
                type: "CHANGE",
                payload: idx,
            });
            setAllFalse(!Object.values(showState).some((val) => val === true));
        },
        [showState]
    );

    // for closing the dropdown
    const menuClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        if (
            (event.target as Element).className === "menu" ||
            (event.target as Element).className === "menu-list"
        ) {
            setMenuClick(true);
        }
    };

    const { clicked, clearClick } = useClickOutside(ref);

    useEffect(() => {
        if (clicked || menuClick) {
            dispatch({
                type: "CLOSE",
            });
            setAllFalse(!Object.values(showState).some((val) => val));
            setMenuClick(false);
        }
        clearClick();
    }, [showState, menuClick, clicked, clearClick]);

    const [width] = useWindow();

    return (
        <div ref={ref}>
            <div className="menu" onClick={menuClickHandler}>
                <button
                    onClick={showHandler.bind(null, 0)}
                    className={`menu__button ${showState[`s${0}`] ? "menu__button-active" : ""}`}
                >
                    {"Products"}
                    <span className="menu__button-triangle">▲</span>
                </button>
                <button
                    onClick={showHandler.bind(null, 1)}
                    className={`menu__button ${showState[`s${1}`] ? "menu__button-active" : ""}`}
                >
                    {"Week Offers"}
                    <span className="menu__button-triangle">▲</span>
                </button>
            </div>

            <div className="menu-dropdown">
                <Dropdown
                    show={showState[`s${0}`]}
                    height={width > 840 ? "15rem" : "30rem"}
                    allFalse={allFalse}
                    transitionMs={400}
                    delayMs={700}
                >
                    <div className="menu-dropdown-container">
                        <ul className="menu-dropdown-links">
                            <li className="menu-dropdown-links--item">
                                <Link className="menu-dropdown-link" to={"/products/phones"}>
                                    <DeviceMobile />
                                    {"Phones"}
                                </Link>
                            </li>
                            <li className="menu-dropdown-links--item">
                                <Link className="menu-dropdown-link" to={"/products/laptops"}>
                                    <Laptop />
                                    {"Laptops"}
                                </Link>
                            </li>
                            <li className="menu-dropdown-links--item">
                                <Link className="menu-dropdown-link" to={"/products/tablets"}>
                                    <DeviceTablet />
                                    {"Tablets"}
                                </Link>
                            </li>
                            <li className="menu-dropdown-links--item">
                                <Link className="menu-dropdown-link" to={"/products"}>
                                    <ShoppingBag />
                                    {"Others.."}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </Dropdown>
                <Dropdown
                    show={showState[`s${1}`]}
                    allFalse={allFalse}
                    height={width <= 840 ? "calc(50vh - 8rem)" : "clamp(50rem, 70vh, 70rem)"}
                    transitionMs={700}
                >
                    <TransitionSlider transitionMs={150}>
                        <Offer
                            onClick={() =>
                                navigate(
                                    `/product/iphone-13-pro-max-5g-6gb-ram/620a659fb40c21b6c1ec0721`
                                )
                            }
                            src={"../../images/iphone13Pro-promo-image.jpeg"}
                            content={"iPhone 13 Pro Max for just:"}
                            price={1099}
                        />
                        <Offer
                            onClick={() =>
                                navigate(
                                    `/product/samsung-galaxy-s21-ultra-5g-12gb-ram/620a659fb40c21b6c1ec071a`
                                )
                            }
                            src={"../../images/S21-Ultra-promo-image.jpeg"}
                            content={"S21 Ultra for just:"}
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

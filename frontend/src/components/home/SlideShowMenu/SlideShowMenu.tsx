import { Storefront } from "phosphor-react";
import { FC, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useIntersect } from "../../../hooks";
import { uiActions } from "../../../store/ui";
import { Button, TransitionSlider } from "../../ui-components";
import SlideImage from "../../ui-components/SlideImage";
import Menu from "../Menu";
import "./SlideShowMenu.scss";

const slideItems = [
    {
        path: "laptops",
        description: "See our latest offer for laptops",
        image: "../../../images/laptop-promo-photo.jpeg",
    },
    {
        path: "tablets",
        description: "Choose a tablet from our wide range",
        image: "../../../images/tablet-promo-photo.jpeg",
    },
    {
        path: "phones",
        description: "Get the latest phones",
        image: "../../../images/phone-promo-photo.jpeg",
    },
];

const SlideShowMenu: FC = (props) => {
    const navigate = useNavigate();

    const ref = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const intersecting = useIntersect(ref);
    const { pathname } = useLocation();

    useEffect(() => {
        if (ref.current instanceof HTMLElement) {
            dispatch(
                uiActions.setStickyNav({
                    sticky: !intersecting,
                    animation: true,
                })
            );
            return;
        }
        dispatch(
            uiActions.setStickyNav({
                sticky: true,
                animation: false,
            })
        );
    }, [dispatch, intersecting]);

    return (
        <section ref={pathname === "/" ? ref : undefined} className="slideshow-menu">
            <Menu />
            <div className="slideshow-menu-button">
                <Button link to={"/products"} inverse icon={<Storefront />} iconAfter>
                    SEE ALL
                </Button>
            </div>
            <div className="slideshow-menu__container">
                <TransitionSlider autoFlow dots flowTo="right" delay={5000} transitionMs={300}>
                    {slideItems.map((item, index) => (
                        <SlideImage
                            key={index}
                            hoverable
                            src={item.image}
                            onClick={() => navigate(`products/${item.path}`)}
                        >
                            <div className="slideshow-menu-overlay">
                                <p>{item.description}</p>
                            </div>
                        </SlideImage>
                    ))}
                </TransitionSlider>
            </div>
        </section>
    );
};

export default SlideShowMenu;

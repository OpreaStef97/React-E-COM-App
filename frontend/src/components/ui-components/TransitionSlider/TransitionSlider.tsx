import "./TransitionSlider.scss";
import React, { useEffect, useState, useCallback, FC, ReactElement, ReactNode } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { CaretLeft, CaretRight } from "phosphor-react";
import { useSwipeable } from "react-swipeable";
import { useWindow, useAutoFlow } from "../../../hooks";

const TransitionSlider: FC<{
    children: ReactNode;
    flowTo?: string;
    idx?: number;
    delay?: number;
    autoFlow?: boolean;
    dots?: boolean;
    className?: string;
    dotsPosition?: string;
    buttonLeft?: JSX.Element;
    buttonRight?: JSX.Element;
    transitionMs?: number;
}> = (props) => {
    const [index, setIndex] = useState(0);
    const [forward, setFoward] = useState(true);
    const [clicked, setClicked] = useState(false);
    const [width] = useWindow();
    const { idx, flowTo, autoFlow, delay, transitionMs, children: childrenElements } = props;

    const length = React.Children.count(props.children);
    const children = React.Children.toArray(childrenElements).map((child, index) =>
        React.cloneElement(child as ReactElement, { key: index })
    );

    useEffect(() => {
        if (idx === undefined) return;
        setIndex(idx);
    }, [idx]);

    const nextSlideHandler = useCallback(() => {
        setFoward(true);
        setIndex((prevIdx) => (prevIdx + 1) % length);
    }, [length]);

    const prevSlideHandler = useCallback(() => {
        setFoward(false);
        setIndex((prevIdx) => (prevIdx || length) - 1);
    }, [length]);

    useAutoFlow({
        autoFlow: !!autoFlow,
        clicked: clicked,
        flowTo: flowTo || "right",
        delay: delay || 0,
        nextHandler: nextSlideHandler,
        prevHandler: prevSlideHandler,
        clickHandler: setClicked,
    });

    const handlers = useSwipeable({
        delta: 0,
        preventDefaultTouchmoveEvent: true,
        onSwipedLeft: () => {
            prevSlideHandler();
            setClicked(true);
        },
        onSwipedRight: () => {
            nextSlideHandler();
            setClicked(true);
        },
    });

    return (
        <section className={`slideshow ${forward ? "forwards" : "backwards"}`} {...handlers}>
            <div
                className="next"
                onClick={() => {
                    nextSlideHandler();
                    setClicked(true);
                }}
            >
                {props.buttonRight || <CaretRight />}
            </div>
            <TransitionGroup component={null}>
                <CSSTransition
                    key={index}
                    classNames="slide"
                    addEndListener={(node: any, done: any) =>
                        node.addEventListener("transitionend", done, false)
                    }
                >
                    <div
                        key={index}
                        className={`slide ${props.className}`}
                        style={{
                            transition: `transform ${
                                width <= 840 ? 200 : transitionMs || 300
                            }ms ease-in-out`,
                        }}
                    >
                        {children[index]}
                    </div>
                </CSSTransition>
            </TransitionGroup>
            <div
                className="prev"
                onClick={() => {
                    prevSlideHandler();
                    setClicked(true);
                }}
            >
                {props.buttonLeft || <CaretLeft />}
            </div>
            {props.dots && (
                <div className="slideshow-dots">
                    <div
                        className="slideshow-dots-container"
                        style={{
                            justifyContent: `${props.dotsPosition || "start"}`,
                        }}
                    >
                        {width > 840 &&
                            children.map((_: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={`slideshow-dot ${
                                        idx === index ? "slideshow-dot-active" : ""
                                    }`}
                                    onClick={() => {
                                        setIndex(idx);
                                        setClicked(true);
                                    }}
                                >
                                    <div className="slideshow-dot--inner"></div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default TransitionSlider;

import './TransitionSlider.scss';
import React, { useEffect, useState, useCallback, FC, ReactElement } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { CaretLeft, CaretRight } from 'phosphor-react';

const TransitionSlider: FC<{
    flowTo?: string;
    idx?: number;
    delay?: number;
    autoFlow?: boolean;
    dots?: boolean;
    dotsPosition?: string;
    buttonLeft?: JSX.Element;
    buttonRight?: JSX.Element;
    transitionMs?: number;
}> = props => {
    const [index, setIndex] = useState(0);
    const [forward, setFoward] = useState(true);
    const [clicked, setClicked] = useState(false);

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
        setIndex(prevIdx => (prevIdx + 1) % length);
    }, [length]);

    const prevSlideHandler = useCallback(() => {
        setFoward(false);
        setIndex(prevIdx => (prevIdx || length) - 1);
    }, [length]);

    useEffect(() => {
        if (!autoFlow) {
            return;
        }
        let interval: NodeJS.Timer;
        let timeout: NodeJS.Timeout;
        // sleep
        if (!clicked) {
            interval = setInterval(() => {
                if (flowTo === 'right') {
                    nextSlideHandler();
                }
                if (flowTo === 'left') {
                    prevSlideHandler();
                }
            }, delay || 2000);
        } else {
            timeout = setTimeout(() => {
                setClicked(false);
            }, 20000);
        }
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [autoFlow, flowTo, delay, nextSlideHandler, prevSlideHandler, clicked]);

    return (
        <section className={`slideshow ${forward ? 'forwards' : 'backwards'}`}>
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
                        node.addEventListener('transitionend', done, false)
                    }
                >
                    <div
                        key={index}
                        className={'slide'}
                        style={{
                            transition: `transform ${transitionMs || 300}ms ease-in-out`,
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
                            justifyContent: `${props.dotsPosition || 'start'}`,
                        }}
                    >
                        {children.map((_: any, idx: number) => (
                            <div
                                key={idx}
                                className={`slideshow-dot ${
                                    idx === index ? 'slideshow-dot-active' : ''
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

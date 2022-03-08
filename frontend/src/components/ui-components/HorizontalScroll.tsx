import { FC } from 'react';
import { SwipeableHandlers } from 'react-swipeable';
import './HorizontalScroll.scss';

const HorizontalScroll: FC<{ handlers?: SwipeableHandlers; overflow?: boolean }> = props => {
    return (
        <div className="wrapper">
            <div
                {...props?.handlers}
                style={
                    props.overflow
                        ? {
                              paddingBottom: '25rem',
                              marginBottom: '-25rem',
                          }
                        : {}
                }
                className="horizontal-scroll"
            >
                {props.children}
            </div>
        </div>
    );
};
export default HorizontalScroll;

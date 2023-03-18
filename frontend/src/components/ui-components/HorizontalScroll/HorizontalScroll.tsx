import { FC, ReactNode } from 'react';
import { SwipeableHandlers } from 'react-swipeable';
import './HorizontalScroll.scss';

const HorizontalScroll: FC<{
    children: ReactNode; handlers?: SwipeableHandlers; overflow?: boolean 
}> = props => {
    return (
        <div className="wrapper">
            <div
                {...props?.handlers}
                style={
                    props.overflow
                        ? {
                              paddingBottom: '30rem',
                              marginBottom: '-30rem',
                            //   overflowX: 'hidden',
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

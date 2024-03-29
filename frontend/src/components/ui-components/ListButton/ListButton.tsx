import { CaretLeft, CaretRight, CircleNotch } from 'phosphor-react';
import { FC, ReactNode } from 'react';
import { CSSTransition } from 'react-transition-group';
import './ListButton.scss';

const ListButton: FC<{
    children?: ReactNode;
    className?: string;
    in?: boolean;
    disabled?: boolean;
    isLoading?: boolean;
    onClick?: () => void;
    type?: string;
}> = props => {
    return (
        <CSSTransition in={!props.in} timeout={200} classNames={'fade-btn'} unmountOnExit>
            <>
                <button
                    disabled={props.disabled}
                    onClick={props.onClick}
                    className={`list__btn list__btn-${props.type} ${props.className} ${
                        props.disabled && 'list__btn-disabled'
                    }`}
                    aria-label={'list-btn'}
                >
                    {props.type === 'right' && (
                        <>
                            {props.isLoading && <CircleNotch className="list__btn--load" />}
                            {!props.isLoading && <CaretRight className="list__btn--icon" />}
                        </>
                    )}
                    {props.type === 'left' && <CaretLeft className="list__btn--icon" />}
                    {props.children}
                </button>
            </>
        </CSSTransition>
    );
};

export default ListButton;

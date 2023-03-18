import React, { CSSProperties, FC, ReactNode, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import BackDrop from '../BackDrop';
import { CSSTransition } from 'react-transition-group';
import './Modal.scss';
import { XCircle } from 'phosphor-react';
import { useClickOutside } from '../../../hooks';

type PropsData = {
    children?: ReactNode;
    contentClass?: string;
    style?: CSSProperties;
    headerClass?: string;
    header?: string;
    content?: string;
    footerClass?: string;
    footer?: JSX.Element;
    show: boolean;
    onSubmit?: (event: React.FormEvent) => void;
    onCancel?: () => void;
};

const ModalOverlay: FC<PropsData> = props => {
    const ref = useRef<HTMLDivElement>(null);
    const { clicked, clearClick } = useClickOutside(ref);

    const { onCancel } = props;

    useEffect(() => {
        if (clicked) {
            onCancel?.();
        }
        clearClick();
    }, [clicked, onCancel, clearClick]);

    return ReactDOM.createPortal(
        <div className="modal__container">
            <div className={`modal ${props.contentClass}`} ref={ref}>
                <header className={`modal__header ${props.headerClass}`}>
                    <h2>{props.header}</h2>
                    <XCircle className="modal__close" onClick={props.onCancel} />
                </header>
                <form
                    className="modal-form"
                    onSubmit={props.onSubmit}
                >
                    <div className={`modal__content ${props.content}`}>{props.children}</div>
                    <footer className={`modal__footer ${props.footerClass}`}>{props.footer}</footer>
                </form>
            </div>
        </div>,
        document.getElementById('modal-hook')!
    );
};

const Modal: FC<PropsData> = props => {
    return (
        <>
            {props.show && <BackDrop onClick={props.onCancel} />}
            <CSSTransition
                in={props.show}
                mountOnEnter
                unmountOnExit
                timeout={200}
                classNames={'modal'}
            >
                <ModalOverlay {...props} />
            </CSSTransition>
        </>
    );
};

export default Modal;

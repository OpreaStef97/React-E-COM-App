import { XCircle } from 'phosphor-react';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import './Notification.scss';

const Notification: FC<{
    show: boolean;
    message?: string;
    className?: string;
    error?: boolean;
    style?: { [k: string]: string };
    onCancel?: () => void;
}> = props => {
    const { onCancel, show } = props;
    const navigate = useNavigate();

    const showHandler = () => {
        onCancel && onCancel();
    };

    useEffect(() => {
        if (!show) {
            return;
        }
        const timeout = setTimeout(() => {
            onCancel && onCancel();
        }, 3000);
        return () => clearTimeout(timeout);
    }, [show, onCancel, navigate]);

    return (
        <CSSTransition
            timeout={300}
            in={show}
            classNames={'notification'}
            mountOnEnter
            unmountOnExit
        >
            <div
                className={`notification ${props.error ? 'notification-err' : ''} ${
                    props.className
                }`}
                style={{ ...props.style }}
            >
                <p className="notification-msg">{props.message}</p>
                <XCircle className="notification-close" onClick={showHandler} />
            </div>
        </CSSTransition>
    );
};

export default Notification;

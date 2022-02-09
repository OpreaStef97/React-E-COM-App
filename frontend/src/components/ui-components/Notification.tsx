import { X } from 'phosphor-react';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import './Notification.scss';

const Notification: FC<{
    show: boolean;
    message?: string;
    error?: boolean;
    onCancel?: () => void;
}> = props => {
    const { onCancel, show } = props;
    const navigate = useNavigate();

    const showHandler = () => {
        onCancel && onCancel();
        navigate('/', {
            replace: true,
        });
    };

    useEffect(() => {
        if (!show) {
            return;
        }
        const timeout = setTimeout(() => {
            onCancel && onCancel();
            navigate('/', {
                replace: true,
            });
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
            <div className={`notification ${props.error ? 'notification-err' : ''}`}>
                <p className="notification-msg">{props.message}</p>
                <X className="notification-close" onClick={showHandler} />
            </div>
        </CSSTransition>
    );
};

export default Notification;

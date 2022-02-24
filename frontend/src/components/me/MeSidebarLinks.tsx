import { FC } from 'react';
import { Link } from 'react-router-dom';
import './MeSidebarLinks.scss';

const MeSidebarLinks: FC<{ onClick?: () => void }> = props => {
    const { onClick } = props;

    return (
        <ul className="me-sidebar-list">
            <li className="me-sidebar-item">
                <Link className="me-sidebar-item__link" onClick={onClick} to="/me">
                    My Info
                </Link>
            </li>
            <li className="me-sidebar-item">
                <Link className="me-sidebar-item__link" onClick={onClick} to="/me/favorites">
                    My favorites
                </Link>
            </li>
            <li className="me-sidebar-item">
                <Link className="me-sidebar-item__link" onClick={onClick} to="/me/reviews">
                    My reviews
                </Link>
            </li>
            <li className="me-sidebar-item">
                <Link className="me-sidebar-item__link" onClick={onClick} to="/me/purchases">
                    My purchases
                </Link>
            </li>
        </ul>
    );
};
export default MeSidebarLinks;

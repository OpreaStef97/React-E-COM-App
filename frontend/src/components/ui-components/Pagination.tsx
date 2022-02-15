import { FC } from 'react';
import ListButton from '../products/ListButton';
import './Pagination.scss';

const Pagination: FC<{ className?: string }> = props => {
    return (
        <div className={`pagination ${props.className}`}>
            <ListButton className="pagination-btn" type="left" />
            <ListButton className="pagination-btn">
                <span>1</span>
            </ListButton>
            <ListButton className="pagination-btn">
                <span>2</span>
            </ListButton>
            <ListButton className="pagination-btn">
                <span>3</span>
            </ListButton>
            <ListButton className="pagination-btn">
                <span>4</span>
            </ListButton>
            <ListButton className="pagination-btn">
                <span>5</span>
            </ListButton>
            <ListButton className="pagination-btn" type="right" />
        </div>
    );
};
export default Pagination;

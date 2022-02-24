import { FC } from 'react';
import ListButton from '../products/ListButton';
import { usePagination } from '../../hooks/use-pagination';
import './Pagination.scss';

const Pagination: FC<{
    className?: string;
    onPageChange: (page: number) => void;
    pageNumber: number;
    pageSize: number;
    totalSize: number;
}> = props => {
    const { pageNumber, totalSize, pageSize, onPageChange } = props;

    const paginationRange = usePagination({
        totalCount: totalSize,
        pageSize,
        siblingCount: 0,
        currentPage: pageNumber,
    });

    if (pageNumber === 0 || (paginationRange && paginationRange.length < 2)) {
        return <div style={{ height: '4.5rem', width: '100%' }}></div>;
    }

    const nextHandler = () => {
        onPageChange(pageNumber + 1);
    };

    const prevHandler = () => {
        onPageChange(pageNumber - 1);
    };

    const pageChangeHandler = (p: number) => {
        onPageChange(p);
    };

    let lastPage = (paginationRange && paginationRange[paginationRange.length - 1]) || 0;
    return (
        <div className={`pagination ${props.className}`}>
            <ListButton
                disabled={pageNumber <= 1}
                className={`pagination-btn`}
                type="left"
                onClick={prevHandler}
            />
            {paginationRange &&
                paginationRange.map((currentPage, i) => {
                    if (currentPage === '...') {
                        return (
                            <ListButton key={i} className="pagination-btn dots">
                                {currentPage}
                            </ListButton>
                        );
                    }

                    return (
                        <ListButton
                            className={`pagination-btn ${
                                pageNumber === currentPage ? 'active' : ''
                            }`}
                            onClick={pageChangeHandler.bind(null, currentPage as number)}
                            key={i}
                        >
                            <span>{currentPage}</span>
                        </ListButton>
                    );
                })}
            <ListButton
                className={`pagination-btn`}
                type="right"
                disabled={pageNumber >= lastPage}
                onClick={nextHandler}
            />
        </div>
    );
};
export default Pagination;

import { FC } from 'react';
import ListButton from '../products/ListButton';
import { usePagination } from '../../hooks/use-pagination';
import './Pagination.scss';

const Pagination: FC<{
    className?: string;
    onNext: () => void;
    onPrev: () => void;
    onChange: (p:number) => void;
    pageNumber: number;
    pageSize: number;
    totalSize: number;
}> = props => {
    const { pageNumber, totalSize, pageSize, onNext, onPrev, onChange } = props;

    const paginationRange = usePagination({
        totalCount: totalSize,
        pageSize,
        siblingCount: 0,
        currentPage: pageNumber,
    });

    if (pageNumber === 0 || (paginationRange && paginationRange.length < 2)) {
        return <div style={{ height: '4.5rem', width: '100%' }}></div>;
    }

    let lastPage = (paginationRange && paginationRange[paginationRange.length - 1]) || 0;
    return (
        <div className={`pagination ${props.className}`}>
            <ListButton
                disabled={pageNumber <= 1}
                className={`pagination-btn`}
                type="left"
                onClick={onPrev}
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
                            onClick={onChange.bind(null, currentPage as number)}
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
                onClick={onNext}
            />
        </div>
    );
};
export default Pagination;

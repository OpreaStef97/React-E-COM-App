import { useState, useEffect } from 'react';
import { SelectState } from './use-select';

export default function useReviewSort(selectState: SelectState) {
    const [sorting, setSorting] = useState<string>();
    useEffect(() => {
        if (!selectState || !selectState['sort']) {
            return;
        }
        const { selected, options } = selectState['sort'];
        const idx = selected.findIndex((val: boolean) => val === true);
        if (idx !== -1) {
            switch (options[idx]) {
                case 'Top rated':
                    setSorting('-rating');
                    break;
                case 'Low rated':
                    setSorting('rating');
                    break;
                case 'Newest':
                    setSorting('-createdAt');
                    break;
                case 'Oldest':
                    setSorting('createdAt');
                    break;
            }
        } else setSorting('');
    }, [selectState]);

    return sorting;
}

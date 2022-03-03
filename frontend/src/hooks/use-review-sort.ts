import { useState, useEffect } from 'react';
import { SelectState } from './use-select';

export default function useReviewSort(selectState: SelectState) {
    const [sortingD, setSortingD] = useState<string>();
    const [sortingR, setSortingR] = useState<string>();
    useEffect(() => {
        if (!selectState || !selectState['sortR']) {
            return;
        }
        const { selected, options } = selectState['sortR'];
        const idx = selected.findIndex((val: boolean) => val === true);
        if (idx !== -1) {
            switch (options[idx]) {
                case 'Top rated':
                    setSortingR('-rating');
                    break;
                case 'Low rated':
                    setSortingR('rating');
                    break;
            }
        } else setSortingR('');
    }, [selectState]);

    useEffect(() => {
        if (!selectState || !selectState['sortD']) {
            return;
        }
        const { selected, options } = selectState['sortD'];
        const idx = selected.findIndex((val: boolean) => val === true);
        if (idx !== -1) {
            switch (options[idx]) {
                case 'Newest':
                    setSortingD('-createdAt');
                    break;
                case 'Oldest':
                    setSortingD('createdAt');
                    break;
            }
        } else setSortingD('');
    }, [selectState]);

    return { sortingD, sortingR };
}

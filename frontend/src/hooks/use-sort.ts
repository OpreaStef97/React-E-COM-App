import { useEffect } from 'react';

const useSort = (
    data: any,
    setFn1: (...args: any[]) => void,
    setFn2: (...args: any[]) => void,
    sortData: any[]
) => {
    useEffect(() => {
        if (Object.keys(data).length === 0) return;

        const { selected } = data['sort'];
        if (!selected[0] && !selected[1]) {
            setFn1(undefined);
            setFn2([...sortData]);
        }
        if (selected[0]) {
            setFn1('Ascending');
            setFn2((prevItems: any[]) => prevItems.sort((a, b) => a.price - b.price));
        }
        if (selected[1]) {
            setFn1('Descending');
            setFn2((prevItems: any[]) => prevItems.sort((a, b) => b.price - a.price));
        }
    }, [data, setFn1, setFn2, sortData]);
};

export default useSort;

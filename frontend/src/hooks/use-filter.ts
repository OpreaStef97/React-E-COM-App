import { useEffect } from 'react';

const useFilter = (data: any, id: string, setFn: (...args: any[]) => void) => {
    useEffect(() => {
        if (Object.keys(data).length === 0) {
            return;
        }
        const { selected, options } = data[id];
        const indexes: number[] = [];
        for (let i = 0; i < selected.length; ++i) {
            if (selected[i]) indexes.push(i);
        }
        if (indexes.length > 0)
            setFn((prevItems: any[]) =>
                prevItems.filter(item => {
                    for (const idx of indexes) {
                        if (
                            Object.keys(item).some(key => {
                                if (item[key] instanceof Array && item[key] === item[id]) {
                                    return item[key].some((v: any) => v === options[idx]);
                                }
                                return item[key] === item[id] && item[key] === options[idx];
                            })
                        ) {
                            return true;
                        }
                    }
                    return false;
                })
            );
    }, [data, setFn, id]);
};

export default useFilter;

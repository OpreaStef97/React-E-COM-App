import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchValues } from '../store/products-actions';

const useSetOptions = (setFn: (data: any) => void, category: string) => {
    const dispatch = useDispatch();
    const { values } = useSelector((state: any) => state.products);

    useEffect(() => {
        dispatch(fetchValues('brand,default.RAM,default.storage,type', category));
    }, [dispatch, category]);

    useEffect(() => {
        if (values.length > 0) {
            const options = {
                ...Object.fromEntries(
                    values.flatMap((val: any) => {
                        return Object.keys(val).map(key => {
                            let options = [...val[key]];
                            if (key === 'RAM') {
                                options.sort((a: string, b: string) => {
                                    const n1 = +a.slice(0, -2);
                                    const n2 = +b.slice(0, -2);
                                    return n1 - n2;
                                });
                            }

                            if (key === 'storage') {
                                const GB = options.filter(option => option.slice(-2) === 'GB');
                                const TB = options.filter(option => option.slice(-2) === 'TB');

                                GB.sort((a: string, b: string) => {
                                    const n1 = +a.slice(0, -2);
                                    const n2 = +b.slice(0, -2);
                                    return n1 - n2;
                                });
                                TB.sort((a: string, b: string) => {
                                    const n1 = +a.slice(0, -2);
                                    const n2 = +b.slice(0, -2);
                                    return n1 - n2;
                                });

                                options = GB.concat(TB);
                            }
                            return [
                                key,
                                {
                                    options,
                                    selected: val[key].map(() => false),
                                },
                            ];
                        });
                    })
                ),
                sort: {
                    options: ['Ascending', 'Descending'],
                    selected: [false, false],
                },
            };
            setFn(options);
        }
    }, [category, setFn, values]);
};
export default useSetOptions;

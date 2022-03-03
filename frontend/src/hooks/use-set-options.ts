import { useEffect, useState } from 'react';
import { SelectState } from './use-select';
import useFetch from './use-fetch';

const useSetOptions = (category: string) => {
    const { sendRequest } = useFetch();
    const [values, setValues] = useState<any>([]);
    const [options, setOptions] = useState<SelectState>({});

    useEffect(() => {
        sendRequest({
            url: `${
                process.env.REACT_APP_API_URL
            }/products/values?fields=${'brand,default.RAM,default.storage,type'}${
                category === 'All' ? '' : `&category=${category}`
            }`,
        })
            .then(data => {
                setValues(data[category]);
            })
            .catch(console.error);
    }, [sendRequest, category]);

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
                    options: ['Price: Low', 'Price: High', 'No. of Reviews', 'Best Rating'],
                    selected: [false, false, false, false],
                },
                show: {
                    options: ['5/page', '10/page', '20/page', '30/page'],
                    selected: [false, true, false, false],
                },
            };
            setOptions(options);
        }
    }, [category, values]);

    return options;
};
export default useSetOptions;

import { useCallback, useReducer } from 'react';
import { selectReducer } from '../utils/reducers';

export default function useSelect() {
    const [selectState, dispatch] = useReducer(selectReducer, {});

    const setHandler = useCallback(
        (options: any) =>
            dispatch({
                type: 'SET_DATA',
                payload: options,
            }),
        []
    );

    const selectHandler = useCallback((id: string, value: string, uniqueSelect: boolean) => {
        dispatch({
            type: 'SELECT',
            uniqueSelect,
            value,
            id,
        });
    }, []);
    const deleteHandler = useCallback((id?: string) => {
        dispatch({
            type: 'DELETE',
            id,
        });
    }, []);

    return {
        selectState,
        setHandler,
        selectHandler,
        deleteHandler,
    };
}

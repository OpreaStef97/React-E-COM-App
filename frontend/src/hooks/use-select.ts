import { useCallback, useReducer } from 'react';

export type SelectState = {
    [key: string]: {
        options: string[];
        selected: boolean[];
    };
};

const selectReducer = (
    state: SelectState,
    action: {
        type: string;
        [key: string]: any;
    }
): SelectState => {
    switch (action.type) {
        case 'SET_DATA': {
            return {
                ...action.payload,
            };
        }
        case 'SELECT': {
            // find to which menu belongs the select event
            const idx = state[action.id].options.findIndex((value: any) => action.value === value);

            if (action.onlySelect) {
                state[action.id].selected[idx] = true;

                for (let i = 0; i < state[action.id].selected.length; ++i) {
                    if (idx !== i) state[action.id].selected[i] = false;
                }
                return {
                    ...state,
                };
            }

            // update the state array for the given id
            state[action.id].selected[idx] = !state[action.id].selected[idx];

            // if the select-menu have the uniqueSelect prop cancel other selected items
            if (action.uniqueSelect) {
                const deleteSelected = state[action.id].selected;
                for (let i = 0; i < deleteSelected.length; ++i) {
                    if (idx !== i) deleteSelected[i] = false;
                }
                state[action.id].selected = deleteSelected;
            }
            return { ...state };
        }
        case 'DELETE': {
            const deleteSelected = state[action.id].selected;
            for (let i = 0; i < deleteSelected.length; ++i) {
                deleteSelected[i] = false;
            }
            return {
                ...state,
                [action.id]: {
                    ...state[action.id],
                    selected: deleteSelected,
                },
            };
        }
        default:
            return {};
    }
};

export default function useSelect(initialState?: SelectState) {
    const [selectState, dispatch] = useReducer(selectReducer, initialState || {});

    const setHandler = useCallback(
        (options: any) =>
            dispatch({
                type: 'SET_DATA',
                payload: options,
            }),
        []
    );

    const selectHandler = useCallback(
        (id: string, value: string, uniqueSelect: boolean, onlySelect: boolean) => {
            dispatch({
                type: 'SELECT',
                uniqueSelect,
                onlySelect,
                value,
                id,
            });
        },
        []
    );
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

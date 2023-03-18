import { useCallback, useReducer } from "react";

export type InputType<T> = {
    [key: string]:
        | {
              value: T;
              isValid: boolean;
          }
        | undefined;
};

type State<T> = {
    isValid: boolean;
    inputs: InputType<T>;
};

type Action = {
    type: string;
    [key: string]: any;
};

const initialState = {
    isValid: false,
    inputs: null,
};

const formReducer = <T>(state: State<T>, action: Action) => {
    switch (action.type) {
        case "INPUT_CHANGE":
            let formIsValid = true;
            // console.log(action);
            for (const inputId in state.inputs) {
                if (!state.inputs[inputId]) {
                    continue;
                }
                if (inputId === action.inputId) {
                    // if one of the inputs is invalid, then the entire form is invalid
                    formIsValid = formIsValid && action.isValid;
                } else {
                    // title.isValid || description.isValid might be false so we update formIsValid boolean state accordingly
                    formIsValid = formIsValid && !!state.inputs[inputId]?.isValid;
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {
                        value: action.value,
                        isValid: action.isValid,
                    },
                },
                isValid: formIsValid,
            };
        case "SET_DATA":
            return {
                inputs: action.inputs,
                isValid: action.formIsValid,
            };
        default:
            return initialState;
    }
};

type FormReturnType<T> = [
    State<T>,
    (id: string, value: T, isValid: boolean) => void,
    (inputData: InputType<T>, formValidity: boolean) => void
];

export const useForm = <T>(
    initialInputs: InputType<T>,
    initialFormValidity: boolean
): FormReturnType<T> => {
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity,
    });

    const inputHandler = useCallback((id: string, value: T, isValid: boolean) => {
        dispatch({
            type: "INPUT_CHANGE",
            value,
            isValid,
            inputId: id,
        });
    }, []);

    const setFormData = useCallback((inputData: InputType<T>, formValidity: boolean) => {
        dispatch({
            type: "SET_DATA",
            inputs: inputData,
            formIsValid: formValidity,
        });
    }, []);

    return [formState, inputHandler, setFormData];
};
